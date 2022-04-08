
<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'app',
    mounted () {
      this.$storage.setItem('age',"30")
      // console.log(this.$storage.getItem("age"))
      // this.$storage.clearItem("age")
      // this.$storage.clearAll()
    }
  }
</script>

<style>

</style>
