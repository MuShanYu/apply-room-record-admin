<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device !== 'mobile'">

        <el-tooltip content="项目地址" effect="dark" placement="bottom">
          <div @click="goto" class="right-menu-item hover-effect">
            <svg-icon icon-class="github" />
          </div>
        </el-tooltip>

        <el-tooltip content="更新版本" effect="dark" placement="bottom">
          <div @click="handleUpdateWeb" class="right-menu-item hover-effect">
            <svg-icon icon-class="refresh" />
          </div>
        </el-tooltip>

        <screen-full id="screenfull" class="right-menu-item hover-effect" />

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="config.avatar" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ScreenFull from "@/components/ScreenFull/index.vue";

import config from "@/common/sys-config";

import configApi from '@/api/config'

import Cookies from 'js-cookie'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ScreenFull
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userInfo',
      'device'
    ]),
    config() {
      return config
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$confirm('您确认要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/logout').then(() => {
          this.$router.replace(`/login`)
        })
      }).catch(() => {

      })
    },
    handleUpdateWeb() {
      let key = "webVersion"
      configApi.querySysConfigByKeyApi(key).then(res => {
        let configValue = JSON.parse(res.configValue)
        let localKey = "version";
        let storedVersion = Cookies.get(localKey)
        let currentVersion = configValue.currentVersion
        if (storedVersion) {
          // 比较版本
          if (storedVersion !== currentVersion) {
            this.$message.success({
              message: '发现新版本，已将版本从' + storedVersion + '更新至' + currentVersion,
              duration: 3000
            });
            setTimeout(() => {
              window.location.reload();
              Cookies.set(localKey, currentVersion);
            }, 3000)
          } else {
            this.$message.info({
              message: '已经是最新版本，无需更新',
              duration: 3000
            });
          }
        } else {
          // 存储版本
          this.$message.success({
            message: '更新至最新版本' + currentVersion,
            duration: 3000
          });
          setTimeout(() => {
            Cookies.set(localKey, currentVersion);
            window.location.reload();
          }, 3000)
        }
      })
    },
    goto() {
      window.open('https://github.com/MuShanYu')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }


    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
