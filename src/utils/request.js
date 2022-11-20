import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

import constants from "@/common/sys-config";

// create an axios instance
const service = axios.create({
  baseURL: constants.baseUrl, // url = base url + request url
  // baseURL: 'https://www.mushanyu.xyz:8500', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // 文件下载
    if (response.config.responseType === 'blob') {
      return response
    }
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 需要动态刷新token
      if (res.code === -2 || res.code === -3 || res.code === -4 || res.code === -5) {
        store.dispatch('user/logout').then(() => {
          Message({
            message: '您的登录状态过期或者无效，请您重新登录！',
            type: 'error',
            duration: 2500
          })
        })
      } else if (res.code === -1) {
        MessageBox.confirm('未登录，请先登录！', '提示', {
          confirmButtonText: '登录',
          showCancelButton: false,
          type: 'warning',
        }).then(() => {
          // 清除数据然后跳转至登录
          router.replace(`/login`)
        })
      } else if (res.code === 999) {

      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 2500
        })
      }
      return Promise.reject(res.message || "Error")
    } else {
      return res.queryData
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
