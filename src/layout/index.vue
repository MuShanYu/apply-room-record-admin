<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar/>
        <tags-view v-if="needTagsView"/>
      </div>
      <app-main/>
      <div style="background-color:  #f5f7f9;padding: 25px;display: flex;align-items: center;justify-content: center;">
        <a style="color: #909399;" href="https://beian.miit.gov.cn/" target="_blank">皖ICP备2022007174号-3</a>
      </div>
    </div>
  </div>
</template>

<script>
import TagsView from './components/TagsView/index'
import RightPanel from '@/components/RightPanel'
import {AppMain, Navbar, Sidebar} from './components'
import ResizeMixin from './mixin/ResizeHandler'
import {mapState} from 'vuex'
import {getUserInfo} from "@/utils/auth";
import {closeWebsocket, sendWebsocket} from "@/utils/websocket";
import SysConfig from "@/common/sys-config";

import Bowser from 'bowser'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    RightPanel
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    sysConfig() {
      return SysConfig;
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    this.buildSocketConnect()
  },
  beforeDestroy() {
    closeWebsocket()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
    },
    buildSocketConnect() {
      const whiteList = ['/login']
      const user = getUserInfo()
      if (user) {
        // 建立web socket连接
        if (whiteList.indexOf(this.$route.fullPath) === -1) {
          // 发送在线信息
          let sendMsg = Bowser.name + Bowser.version + '(' + Bowser.osname + ')'
          sendWebsocket(this.sysConfig.websocketPath + "?userId=" + user.id, sendMsg, msg => {
            this.$store.dispatch('app/connectSocketChannel', msg)
          }, e => {})
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>
