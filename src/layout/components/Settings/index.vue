<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">系统布局设置与帮助</h3>

      <div class="drawer-item">
        <span>快捷导航标签</span>
        <el-switch v-model="tagsView" class="drawer-switch"/>
      </div>

      <div class="drawer-item">
        <span>固定顶部导航栏</span>
        <el-switch v-model="fixedHeader" class="drawer-switch"/>
      </div>

      <div class="drawer-item">
        <span>显示logo与欢迎语</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch"/>
      </div>

      <div class="drawer-help-item">
        <div>首页图表说明与帮助</div>
        <div @click.stop="handleShowDashboardHelpClick" class="drawer-help-btn">查看</div>
      </div>

      <div class="drawer-help-item">
        <div>房间管理说明与帮助</div>
        <div @click.stop="handleShowRoomListHelpClick" class="drawer-help-btn">查看</div>
      </div>

      <div v-if="isSuperAdmin" class="drawer-help-item">
        <div>配置管理说明与帮助</div>
        <div @click="handleShowConfigListHelpClick" class="drawer-help-btn">查看</div>
      </div>

    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {}
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    ...mapState({
      roles: state => state.user.roles
    }),
    isSuperAdmin() {
      return this.$store.getters.roles.some(v => v === 'super-admin')
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    handleShowDashboardHelpClick() {
      this.$emit('handleShowHelpClick', '/dashboard')
    },
    handleShowRoomListHelpClick() {
      this.$emit('handleShowHelpClick', '/room/room')
    },
    handleShowConfigListHelpClick() {
      this.$emit('handleShowHelpClick', '/config/index')
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }

  .drawer-help-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
  }

  .drawer-help-btn,
  .drawer-help-btn:focus {
    color: #409EFF;
    cursor: pointer;

    &:hover {
      color: #409EFF;
    }
  }

}
</style>
