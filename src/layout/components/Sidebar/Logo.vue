<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img alt="logo" v-if="config.logo" :src="config.logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ userInfo ? '欢迎您，' + userInfo.name : '请登录' }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img alt="logo" v-if="config.logo" :src="config.logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ userInfo ? '欢迎您，' + userInfo.name : '请登录' }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import config from "@/common/sys-config";
import {mapState} from "vuex";

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    config() {
      return config
    },
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
  },
  data() {
    return {
      title: '房间预约与人员流动统计',
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  //background: #263446;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
      margin-left: 6px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
