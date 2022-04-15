<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item,index) in breadList" :key="item.path">
      <router-link to="/weclome" v-if="index == 0">{{item.meta.title}}</router-link>
      <span v-else>{{item.meta.title}}</span>
      </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
export default {
  name: "Breadcrumb",
  components:{
    ArrowRight
  },
  computed:{
    breadList(){
      return this.$route.matched
    }
  },
  // mounted () {
  //   console.log(this.$route)
  // }
};
</script>

<style>
</style>