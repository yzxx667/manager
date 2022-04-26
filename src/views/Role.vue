<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="queryForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.menuName" placeholder="请输入角色名称" />
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
      <el-table
        :data="roleList"
      >
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
            <el-button size="small" type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="small" @click="handleEdit(scope.row)"
              >设置权限</el-button
            >
            <el-button type="danger" size="small" @click="handleDel(scope.row._id)"
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
          <el-input
            v-model="roleForm.roleName"
            placeholder="请输入角色名称"
          >
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
      action:'',
      //角色信息
      roleForm:{

      },
      showModal:false,
      roleList:[],
      //分页,
      pager:{
        total:0,
        pageSize:10
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
           width:200
        },
        {
          label: "权限列表",
          prop: "permissionList",
          width:280
        },
        {
          label: "创建时间",
          width: 300,
          prop: "createTime",
          formatter(row, colum, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      rules:{
        roleName:[
          {
            required:true,
            message:'请输入角色名称',
            trigger:'blur'
          }
        ]
      }
    };
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      try {
        let { list , page } = await this.$api.getRoleFormList(this.queryForm);
        this.roleList = list;
        this.pager.total = page.total
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
    handleAdd() {
      this.action = 'create'
      this.showModal = true;
    },
    handleEdit(row) {
      this.showModal = true
      this.action = 'edit'
      this.$nextTick(()=>{
       Object.assign(this.roleForm,row)
      })
    },
    async handleDel(_id) {
      await this.$api.roleSubmit({_id,action:'delete'});
      this.getRoleList()
      this.$message.success('删除成功')
    },
    handleSubmit() {
      this.$refs.roledialog.validate(async (valid) => {
        if (valid) {
          let {action,roleForm} = this
          let params = {action,...roleForm}
          let res = await this.$api.roleSubmit(params)
          this.$message.success('操作成功')
          this.showModal = false
          this.handleReset('roledialog')
          this.getRoleList()
        }else{
          this.$message.error('提交失败')
        }
      });
    },
    handleClose(){
      this.showModal = false
      this.handleReset('roledialog')
    },
    handleCurrentChange(){}
  },
};
</script>

<style scoped>
</style>