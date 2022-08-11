import userApi from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  removeUserInfo,
  setUserInfo,
  removeRoles,
  setRoles, getRoles
} from '@/utils/auth'
import { resetRouter } from '@/router'
import JSEncrypt from 'jsencrypt'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: getUserInfo(),
    roles: getRoles()
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
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
    setRoles(roles)
  },
  LOGOUT: (state) => {
    state.token = ''
    state.userInfo = null
    state.roles = []
    removeUserInfo()
    removeToken()
    removeRoles()
    resetRouter()
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
          if (data !== null) {
            commit('SET_TOKEN', data.token)
            commit('SET_USER_INFO', data.user)
            commit('SET_ROLES', data.roles)
            resolve()
          } else {
            reject()
          }
        }).catch(error => {
          reject(error)
        })
      })
    })
  },
  refreshToken({commit}, userId) {
    userApi.refreshToken(userId).then(data => {
      commit('SET_TOKEN', data.token)
    })
  },
  logout({ commit }) {
    commit('LOGOUT')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

