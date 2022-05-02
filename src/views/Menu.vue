<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="菜单名称" prop="memuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select
            v-model="queryForm.menuState"
            :popper-append-to-body="false"
          >
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table
        :data="menuList"
        row-key="_id"
        :tree-props="{ children: 'children' ,hasChildren: 'hasChildren'}"
      >
        <!-- <el-table-column width="20" /> -->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button size="small" @click="handleAdd(2, scope.row)" type="primary"
              >新增</el-button
            >
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        class="pagination"
        background
        layout="prev, pager, next,jumper"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      /> -->
    </div>

    <el-dialog title="创建菜单" v-model="showModal">
      <el-form
        :model="menuForm"
        label-width="100px"
        :rules="rules"
        ref="menudialog"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            :popper-append-to-body="false"
            clearable
          ></el-cascader>
          <span>不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio v-model="menuForm.menuType" label="1">菜单</el-radio>
          <el-radio v-model="menuForm.menuType" label="2">按钮</el-radio>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menuForm.menuName"
            placeholder="请输入用户菜单名称"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType == 1">
          <el-input
            v-model="menuForm.icon"
            placeholder="请输入菜单图标"
          ></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType == 1">
          <el-input
            v-model="menuForm.path"
            placeholder="请输入路由地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType == 2">
          <el-input
            v-model="menuForm.menuCode"
            placeholder="请输入权限标识"
          ></el-input>
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType == 1">
          <el-input
            v-model="menuForm.component"
            placeholder="请输入组件路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType == 1">
          <el-radio v-model="menuForm.menuState" label="1">正常</el-radio>
          <el-radio v-model="menuForm.menuState" label="2">停用</el-radio>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "./../utils/utils";
export default {
  name: "menu",
  data() {
    return {
      queryForm: {
        menuState: 1,
      },
      menuList: [],
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
          width: 180,
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter(row, colum, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          width: 90,
          formatter(row, colum, value) {
            return {
              1: "正常",
              2: "停用",
            }[value];
          },
        },
        {
          label: "创建时间",
          width: 150,
          prop: "createTime",
          formatter(row, colum, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      // 菜单按钮单选
      menuForm: {
        menuType: "1",
        menuState: "1",
      },
      // 展示dialog
      showModal: false,
      // 增加还是编辑表单
      action: "",
      // 表单校验
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 6,
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList(this.queryForm);
        this.menuList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    handleQuery() {
      this.getMenuList()
    },
    handleReset(form) {
       this.$refs[form].resetFields();
    },
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
      if (type == 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter((item)=>item)
      }
    },
    handleEdit(row) {
      this.showModal = true
      this.action = 'edit'
      this.$nextTick(()=>{
       Object.assign(this.menuForm,row)
      })
    },
    async handleDel(_id) {
      await this.$api.menuSubmit({_id,action:'delete'});
      this.getMenuList()
      this.$message.success('删除成功')
    },
    handleSubmit() {
      this.$refs.menudialog.validate(async (valid) => {
        if (valid) {
          let action = this.action;
          let params = { action, ...this.menuForm };
          let res = await this.$api.menuSubmit(params);
          this.$message.success('提交成功')
          this.showModal = false
          this.handleReset('menudialog')
          this.getMenuList()
        }else{
          this.$message.error('提交失败')
        }
      });
    },
    handleClose(){
      this.showModal = false
      this.handleReset('menudialog')
    }
  },
};
</script>

<style scoped>
</style>