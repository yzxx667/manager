<template>
  <h1>欢迎来到登录界面</h1>
  <weclome msg="jack" />
  <el-button @click="goHome">回首页</el-button>
</template>

<script>
import request from '../utils/request'
import Weclome from './Welcome.vue'

export default {
  name: 'login',
  components: {
    Weclome
  },
  mounted() {
    /*
    this.$request({
      method:'get',
      url: '/login',
      data:{
        name:'jack'
      }
    }).then( (res)=>{
      console.log(res)
    })
    */
    //  request.get('/login',{name:'jack'},{mock:true,loading:true}).then((res)=>{
    //    console.log(res)
    //  })
  },
  methods: {
    goHome() {
      this.$router.push('/weclome')
    }
  }
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
