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
          <el-select v-model="user.state">
            <el-option label="所有" :value="0" />
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="1" />
            <el-option label="试用期" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="userList">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
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
  </div>
</template>s

<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
export default {
  name: "user",
  setup() {
    const { proxy } = getCurrentInstance();
    const user = reactive({
        state: 0
    });
    const userList = ref([]);
    const pager = reactive({
        pageNum: 1,
        pageSize: 10,
        total:0
    })
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
      },
      {
        label: "用户状态",
        prop: "state",
      },
      {
        label: "注册时间",
        prop: "createTime",
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
      },
    ]);
    onMounted(() => {
      getUserList();
    });
    const getUserList =async () => {
        let params = {...user,...pager}
        try {
            const { list, page} = await proxy.$api.getUserList(params)
            userList.value = list;
            pager.total = page.total
        } catch (error) {
            console.error(error)
        }

    };

    // 查询,获取用户列表
    const  handleQuery = ()=>{
        getUserList()
    }

    // 重置
    const  handleReset = ()=>{
        proxy.$refs.form.resetFields()
    }

    // 分页事件
    const handleCurrentChange = (current)=> {
        pager.pageNum = current
        getUserList()
    }
    return {
      user,
      userList,
      columns,
      pager,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange
    };
  },
};
</script>

<style>
</style>