<template>
  <template v-for="menu in userMenu" :key="menu._id">
    <el-sub-menu
      v-if="
        menu.children && menu.children.length>0 && menu.children[0].menuType == 1
      "
      :index="menu.path"
    >
      <template #title>
        <el-icon><setting /></el-icon>
        <span>{{ menu.menuName }}</span>
      </template>
      <tree-menu :userMenu="menu.children" />
    </el-sub-menu>
    <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path">{{
      menu.menuName
    }}</el-menu-item>
  </template>
</template>

<script>
import { Setting, Expand, Bell } from "@element-plus/icons-vue";
export default {
  name: "TreeMenu",
  components: {
    Setting,
    Expand,
    Bell,
  },
  props: {
    userMenu: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style>
</style>