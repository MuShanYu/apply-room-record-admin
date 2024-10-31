import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import router from '@/router'
import {getLoginExpireTime, getToken, getUserId} from '@/utils/auth'

import constants from "@/common/sys-config";

const whiteList = [
  "/config/get/by/",
  "/user/logout",
  "/admin/login"
]

const service = axios.create({
  baseURL: constants.baseUrl, // url = base url + request url
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const token = getToken()
    if (token) {
      config.headers['token'] = token
    }
    let uri = config.url;
    if (!whiteList.some((item) => uri.startsWith(item))) {
      // 判断是否有登录状态，登录是否过期
      const userId = getUserId();
      const loginExpiredTime = getLoginExpireTime()
      if (!userId || !token) {
        handleServiceError(-1)
        return Promise.reject()
      }
      if (loginExpiredTime < new Date().getTime()) {
        // 登录过期，重新登录
        handleServiceError(-2)
        return Promise.reject()
      }
    }
    // console.sysOperateLog(config);
    return config
  },
  error => {
    // do something with request error
    console.log('request reject') // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // console.sysOperateLog(response);
    // 文件下载
    if (response.config.responseType === 'blob') {
      return response
    }
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      handleServiceError(res.code, res.message)
      return Promise.reject(res.message || "Error")
    } else {
      return res.queryData
    }
  },
  error => {
    if (error) {
      console.log(error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

function handleServiceError(code, message = 'error') {
  if (store.getters.webSocketIsOpen) {
    store.dispatch('websocket/websocketCloseGuanBi').then(r => {})
  }
  if (code === -3 || code === -4 || code === -5) {
    store.dispatch('user/logout').then(() => {
      Message({
        message: '您的登录状态异常，请您重新登录！',
        type: 'error',
        duration: 2500
      })
      router.replace(`/login`)
    })
  } else if (code === -2) {
    store.dispatch('user/logout').then(() => {
      Message({
        message: '您的登录状态过期，请您重新登录！',
        type: 'error',
        duration: 2500
      })
      // 清除数据然后跳转至登录
      router.replace(`/login`)
    })
  }
  else if (code === -1) {
    store.dispatch('user/logout').then(() => {
      Message({
        message: '未登录，请先登录！',
        type: 'error',
        duration: 2500
      })
      // 清除数据然后跳转至登录
      router.replace(`/login`)
    })
  } else {
    Message({
      message: message || 'Error',
      type: 'error',
      duration: 2500
    })
  }
}

export default service
