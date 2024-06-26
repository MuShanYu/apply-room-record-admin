import userApi from '@/api/user'
import {getUserPermissionAndRole} from "@/api/user";
import {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  removeUserInfo,
  setUserInfo
} from '@/utils/auth'
import router from '@/router'
import {Message} from "element-ui";

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: getUserInfo(),
    roles: [],
    permissions: []
  }
}

const state = getDefaultState()

const mutations = {
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
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  LOGOUT: (state) => {
    userApi.logout().then(() => {
      state.token = null
      state.userInfo = null
      state.roles = []
      state.permissions = []
      removeUserInfo()
      removeToken()
      router.replace("/login")
    })
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {stuNum, pwd} = userInfo
    return new Promise((resolve, reject) => {
      let userLoginDTO = {
        stuNum: stuNum.trim(),
        pwd: pwd,
        device: userInfo.device
      }
      userApi.login(userLoginDTO).then(data => {
        if (data !== null) {
          commit('SET_TOKEN', data.token)
          commit('SET_USER_INFO', data.user)
          resolve()
        } else {
          Message({
            message: '账号或密码错误',
            type: 'error',
            duration: 2500
          })
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({commit}) {
    commit('LOGOUT')
  },
  updateUserInfo({commit}, newUserInfo) {
    commit('SET_USER_INFO', newUserInfo)
  },
  // 获取用户信息
  getUserPermissionAndRole({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserPermissionAndRole().then(res => {
        if (res.permission && res.permission.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', res.roles)
          commit('SET_PERMISSIONS', res.permission)
        } else {
          commit('SET_PERMISSIONS', ['DEFAULT_PERMISSION'])
        }
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

