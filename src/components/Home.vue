<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapes ? 'fold' : 'unfold']">
      <!-- 系统logo -->
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        class="nav-menu"
        router
        text-color="#fff"
        :collapse="isCollapes"
        background-color="#001529"
      >
        <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapes ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon><expand /></el-icon>
          </div>
          <div class="bread">
            <bread-crumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="noticeCount>0?true:false" class="notice" type="danger">
            <el-icon><bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ UserInfo.userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ UserInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
          <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from './TreeMenu.vue'
import { Setting, Expand, Bell, ArrowDown } from "@element-plus/icons-vue";
import BreadCrumb from './BreadCrumb.vue';
export default {
  name: "Home",
  components: {
    Setting,
    Expand,
    Bell,
    ArrowDown,
    TreeMenu,
    BreadCrumb,
  },
  data() {
    return {
      isCollapes: false,
      UserInfo: this.$store.state.userInfo,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1)
    };
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList()
    
  },
  methods: {
    toggle() {
      this.isCollapes = !this.isCollapes;
    },
    handleLogout(key) {
      if (key == "email") return;
      this.$store.commit("saveUserInfo", "");
      this.userInfo = null;
      this.$router.push("/login");
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.noticeCount();
        this.noticeCount = count;
      } catch (error) {
        console.error(error);
      }
    },
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList();
        this.userMenu = list;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    // overflow-y: auto;
    overflow: hidden;
    transition: all 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        width: 32px;
        height: 32px;
        margin: 0 16px;
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
    }
    // 合并
    &.fold {
      width: 64px;
    }
    // 展开
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 合并
    &.fold {
      margin-left: 64px;
    }
    // 展开
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-top: 7px;
          margin-right: 15px;
          font-size: 18px;
        }
      }
    }
    .user-info {
      .notice {
        line-height: 30px;
        margin-right: 15px;
      }
      .user-link {
        line-height: 47px;
        cursor: pointer;
        color: #409eff;
      }
    }
    .wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
