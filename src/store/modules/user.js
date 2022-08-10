import userApi from '@/api/user'
import {getToken, setToken, removeToken, getUserInfo, removeUserInfo, setUserInfo} from '@/utils/auth'
import { resetRouter } from '@/router'
import JSEncrypt from 'jsencrypt'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: getUserInfo()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
    setUserInfo(userInfo)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { tel, pwd } = userInfo
    return new Promise((resolve, reject) => {
      let key = new Date().getTime()
      userApi.getPublicKey(key).then(data => {
        // 输入密码加密
        let encrypt = new JSEncrypt()
        let publicKey = data.public
        encrypt.setPublicKey(publicKey)
        let rsaPwd = encrypt.encrypt(pwd)
        let userLoginDTO = {
          tel: tel.trim(),
          pwd: rsaPwd,
          key: key
        }
        userApi.login(userLoginDTO).then(data => {
          console.log(data);
          if (data !== null) {
            commit('SET_TOKEN', data.tokenInfo.tokenValue)
            commit('SET_USER_INFO', data.user)
            resolve()
          } else {
            reject()
          }
        }).catch(error => {
          reject(error)
        })
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

