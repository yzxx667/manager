<template>
  <h1>欢迎来到登录界面</h1>
  <weclome msg="jack" />
  <el-button @click="goHome">回首页</el-button>
</template>

<script>
  import Weclome from './Weclome.vue'
  export default {
    name: 'login',
    components:{
      Weclome
    },
    methods: {
      goHome(){
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
