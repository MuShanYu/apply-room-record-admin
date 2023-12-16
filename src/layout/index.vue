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
      <div style="background-color: #ffffff;;padding: 25px;display: flex;align-items: center;justify-content: center;">
        <el-image
          style="width: 20px; height: 20px;margin-right: 5px;"
          src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png"
          fit="cover"></el-image>
        <a style="color: #909399;" href="https://beian.miit.gov.cn/" target="_blank">皖公网安备34162102000332号</a>
      </div>
<!--      <right-panel ref="rightPanel" v-if="showSettings">-->
<!--        <settings @handleShowHelpClick="handleShowHelpClick"/>-->
<!--      </right-panel>-->
    </div>
  </div>
</template>

<script>
import TagsView from './components/TagsView/index'
import RightPanel from '@/components/RightPanel'
import {AppMain, Navbar, Settings, Sidebar} from './components'
import ResizeMixin from './mixin/ResizeHandler'

import homeSteps from "@/layout/steps/home-steps";
import roomListStepsAdmin from "@/layout/steps/room-list-steps-admin";
import roomListStepsSuperAdmin from "@/layout/steps/room-list-steps-super-admin";
import configListSteps from '@/layout/steps/config-list-steps'

import {mapState} from 'vuex'
import Driver from "driver.js";
import 'driver.js/dist/driver.min.css';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Settings,
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
    isSuperAdmin() {
      return this.$store.getters.roles.some(v => v === 'super-admin')
    },
  },
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver({
      doneBtnText: '明白了',
      closeBtnText: '不想看了',
      nextBtnText: '下一步',
      prevBtnText: '上一步',
    })
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
    },
    handleShowHelpClick(toPath) {
      let that = this
      let path = this.$route.path
      if (path !== toPath) {
        this.$message.success('等待数据刷新完毕，1秒后开始帮助演示')
        this.$router.push(toPath)
      }
      this.$refs.rightPanel.closePanel()
      // 等待跳转doom刷新完毕
      this.$nextTick(() => {
        // 开始引导操作
        switch (toPath) {
          case '/dashboard':
            setTimeout(() => {
              that.driver.defineSteps(homeSteps)
              that.driver.start()
            }, 1000)
            break
          case '/room/list':
            setTimeout(() => {
              if (this.isSuperAdmin) {
                that.driver.defineSteps(roomListStepsSuperAdmin)
              } else {
                that.driver.defineSteps(roomListStepsAdmin)
              }
              that.driver.start()
            }, 1000)
            break
          case '/config/index':
            setTimeout(() => {
              that.driver.defineSteps(configListSteps)
              that.driver.start()
            }, 1000)
            break
        }
      })
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
