<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state" :popper-append-to-body="false">
            <el-option label="所有" :value="0" />
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="2" />
            <el-option label="试用期" :value="3" />
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
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="handleDel(scope.row)"
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
        ref="dialogForm"
        :model="userForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="userForm.userName"
            placeholder="请输入用户名称"
            :disabled="action == 'edit'"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            placeholder="请输入用户邮箱"
            :disabled="action == 'edit'"
          >
            <template #append>@imooc.com </template></el-input
          >
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入用户手机号">
          </el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input
            v-model="userForm.job"
            placeholder="请输入用户岗位"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state" :popper-append-to-body="false">
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择系统角色"
            multiple
            style="width: 100%"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId" >
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            style="width: 100%"
            :popper-append-to-body="false"
          ></el-cascader>
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
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import utils from './../utils/utils'
export default {
  name: "user",
  setup() {
    const { proxy } = getCurrentInstance();
    const user = reactive({
      state: 1,
    });
    const userList = ref([]);
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    // 选中用户列表的对象
    const checkedUserIds = ref([]);
    // 弹框显示对象
    const showModal = ref(false);
    // 新增form对象
    const userForm = reactive({
      state: 3,
    });
    // 所有角色列表
    const roleList = ref([]);
    // 所有部门列表
    const deptList = ref([]);
    // 定义用户操作的行为
    const action = ref("add");
    // 定义表单规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          // required: true,
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请输入部门",
          trigger: "blur",
        },
      ],
    });
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row) {
          if (row.role == 0) {
            return "管理员";
          } else {
            return "普通用户";
          }
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[row.state];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        width:180,
        formatter:(row,column,value)=>{
          return utils.formateDate(new Date(value))
        }
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        formatter:(row,column,value)=>{
          return utils.formateDate(new Date(value))
        }
      },
    ]);
    onMounted(() => {
      getUserList();
      getRoleList();
      getDepList();
    });
    const getUserList = async () => {
      let params = { ...user, ...pager };
      try {
        const { list, page } = await proxy.$api.getUserList(params);
        userList.value = list;
        pager.total = page.total;
      } catch (error) {
        console.error(error);
      }
    };

    // 查询,获取用户列表
    const handleQuery = () => {
      getUserList();
    };

    // 重置
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
    };

    // 分页事件
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };

    // 删除方法
    const handleDel = async (row) => {
      await proxy.$api.userDel({
        userIds: [row.userId],
      });
      proxy.$message.success("删除成功");
      getUserList();
    };

    //批量删除
    const handlePatchDel = async () => {
      if (checkedUserIds.value.length == 0) {
        proxy.$message.error("请选择要删除的用户");
        return;
      }
      const res = await proxy.$api.userDel({
        userIds: checkedUserIds.value,
      });
      if (res.nModified > 0) {
        proxy.$message.success("删除成功");
        getUserList();
      } else {
        proxy.$message.error("删除失败");
      }
    };

    // 表格多选
    const handleSelectionChange = (list) => {
      // console.log(list)
      let arr = [];
      list.map((item) => {
        arr.push(item.userId);
      });
      checkedUserIds.value = arr;
    };

    // 用户新增
    const handleCreate = () => {
      action.value = "add";
      showModal.value = true;
    };

    // 部门列表
    const getDepList = async () => {
      let list = await proxy.$api.getDeptList();
      deptList.value = list;
    };

    // 角色列表查询
    const getRoleList = async () => {
      let list = await proxy.$api.getRoleList();
      roleList.value = list;
    };

    // 用户弹窗关闭
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };

    // 用户提交
    const handleSubmit = () => {
      //校验
      proxy.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const params = Object.assign({}, toRaw(userForm));
          params.userEmail += "@imooc.com";
          params.action = action.value;
          // console.log(params)
          let res = await proxy.$api.userSubmit(params);
            showModal.value = false;
            proxy.$message.success("用户创建成功");
            handleReset("dialogForm");
            getUserList();
        }
      });
    };

    // 用户编辑
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      proxy.$nextTick(() => {
        Object.assign(userForm, row);
      });
    };
    return {
      user,
      userList,
      columns,
      pager,
      checkedUserIds,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDel,
      handlePatchDel,
      handleSelectionChange,
      handleCreate,
      showModal,
      userForm,
      rules,
      getDepList,
      getRoleList,
      roleList,
      deptList,
      handleClose,
      handleSubmit,
      handleEdit,
      action,
    };
  },
};
</script>

<style>
</style>