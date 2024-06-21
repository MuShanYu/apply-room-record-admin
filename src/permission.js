import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import configApi from "@/api/config";
import Cookies from "js-cookie";
import {getToken, getUserInfo} from '@/utils/auth'
import store from './store'

import { Message } from 'element-ui'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // 检查版本信息
  handleUpdateWeb()
  // determine whether the user has logged in
  const hasGetUserInfo = getUserInfo()
  const token = getToken()
  if (!hasGetUserInfo || !token) {
    // 白名单的直接放行
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 重新登录去
      next(`/login?redirect=${to.path}`)
    }
  } else {
    store.dispatch('GenerateRoutes').then(accessRoutes => {
      console.log(accessRoutes);
      // 根据roles权限生成可访问的路由表
      // router.addRoutes(accessRoutes) // 动态添加可访问路由表
      // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成

    })
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function handleUpdateWeb() {
  let key = "webVersion"
  configApi.querySysConfigByKeyApi(key).then(res => {
    let configValue = JSON.parse(res.configValue)
    let localKey = "version";
    let storedVersion = Cookies.get(localKey)
    let currentVersion = configValue.currentVersion
    if (storedVersion) {
      // 比较版本
      if (storedVersion !== currentVersion) {
        Message.success({
          message: '发现新版本，已将版本从' + storedVersion + '更新至' + currentVersion,
          duration: 3000
        });
        setTimeout(() => {
          window.location.reload();
          Cookies.set(localKey, currentVersion);
        }, 3000)
      }
    } else {
      // 存储版本
      Message.success({
        message: '更新至最新版本' + currentVersion,
        duration: 3000
      });
      setTimeout(() => {
        Cookies.set(localKey, currentVersion);
        window.location.reload();
      }, 3000)
    }
  })
}
