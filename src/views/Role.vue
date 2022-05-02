<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd()">创建</el-button>
      </div>
      <el-table :data="roleList">
        <el-table-column width="20" />
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
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="small" @click="handleRoleEdie(scope.row)"
              >设置权限</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next,jumper"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="用户新增" v-model="showModal">
      <el-form
        :model="roleForm"
        label-width="100px"
        :rules="rules"
        ref="roledialog"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="roleForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限设置 -->
    <el-dialog title="设置权限" v-model="showPermission">
      <el-form label-width="100px">
        <el-form-item label="角色名称:" prop="roleName">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            default-expand-all
            :data="menuList"
            show-checkbox
            node-key="_id"
            :props="{ label: 'menuName' }"
            ref="treedia"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePermissionClose">取消</el-button>
          <el-button type="primary" @click="handlePermission">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "../utils/utils";
export default {
  name: "menu",
  data() {
    return {
      queryForm: {
        roleName: "",
      },
      // 操作类型,
      action: "",
      //角色信息
      roleForm: {},
      showModal: false,
      roleList: [],
      //分页,
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
          width: 180,
        },
        {
          label: "备注",
          prop: "remark",
          width: 200,
        },
        {
          label: "权限列表",
          prop: "permissionList",
          width: 200,
          formatter: (row, colum, value) => {
            let newArr = []
            // console.log(value)
            value.halfCheckedKeys.forEach(item => {
              if(this.actionList[item]){
                newArr.push(this.actionList[item])
              }
            });
            return newArr.join(',')
          },
        },
        {
          label: "更新时间",
          width: 180,
          prop: "updateTime",
          formatter(row, colum, value) {
            return utils.formateDate(new Date(value));
          },
        },
        {
          label: "创建时间",
          width: 180,
          prop: "createTime",
          formatter(row, colum, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
      showPermission: false,
      // 当前角色名称
      curRoleName: "",
      // 菜单列表
      menuList: [],
      curRoleId: "",
      // formatter
      actionList:[]
    };
  },
  mounted() {
    this.getMenuList();
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      try {
        let { list, page } = await this.$api.getRoleFormList({...this.queryForm,...this.pager});
        this.roleList = list;
        this.pager.total = page.total;
      } catch (error) {
        throw new Error(error);
      }
    },
    handleQuery() {
      this.getRoleList();
    },
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList(this.queryForm);
        this.menuList = list;
        this.getActionList(list)
      } catch (error) {
        throw new Error(error);
      }
    },
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    handleAdd() {
      this.action = "create";
      this.showModal = true;
    },
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.roleForm, {_id:row._id,roleName:row.roleName,remark:row.remark});
      });
    },
    async handleDel(_id) {
      await this.$api.roleSubmit({ _id, action: "delete" });
      this.getRoleList();
      this.$message.success("删除成功");
    },
    handleSubmit() {
      this.$refs.roledialog.validate(async (valid) => {
        if (valid) {
          let { action, roleForm } = this;
          let params = { action, ...roleForm };
          let res = await this.$api.roleSubmit(params);
          this.$message.success("操作成功");
          this.showModal = false;
          this.handleReset("roledialog");
          this.getRoleList();
        } else {
          this.$message.error("提交失败");
        }
      });
    },
    handleClose() {
      this.showModal = false;
      this.handleReset("roledialog");
    },
    handleCurrentChange(current) {
      this.pager.pageNum = current
      this.getRoleList()
    },
    handleRoleEdie(row) {
      this.curRoleName = row.roleName;
      this.curRoleId = row._id;
      // console.log(row)
      this.showPermission = true;
      let { checkedKeys } = row.permissionList;
      setTimeout(() => {
        this.$refs.treedia.setCheckedKeys(checkedKeys);
      });
    },
    handlePermissionClose() {
      this.showPermission = false;
    },
    async handlePermission() {
      let halfCheck = this.$refs.treedia.getHalfCheckedKeys();
      let nodes = this.$refs.treedia.getCheckedNodes();
      let checkedKeys = [];
      let parentKeys = [];
      // console.log(halfCheck)
      // console.log(nodes)
      nodes.map((item) => {
        if (!item.children) {
          checkedKeys.push(item._id);
        } else {
          parentKeys.push(item._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: [...parentKeys, ...halfCheck],
        },
      };
      await this.$api.rolePermission(params);
      this.showPermission = false;
      this.$message.success("设置成功");
      this.getRoleList();
    },
    getActionList(list) {
      let actionList = {};
      const deep = (arr) => {
        /*
        while (arr.length) {
          let item = arr.pop();
          if (item.children && item.action) {
            actionList[item._id] = item.menuName;
          }
          if (item.children) {
            deep(item.children);
          }
        }
        */
        for(let i = 0;i<arr.length;i++){
          if(arr[i].children && arr[i].action){
            actionList[arr[i]._id] = arr[i].menuName;
          }
          if(arr[i].children){
            deep(arr[i].children)
          }
        }
      };
      deep(JSON.parse(JSON.stringify(list)));
      this.actionList = actionList
    },
  },
};
</script>

<style scoped>
</style>