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
import router, { resetRouter } from '@/router'
import {Message} from "element-ui";

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: getUserInfo(),
    roles: getRoles()
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
    setRoles(roles)
  },
  LOGOUT: (state) => {
    userApi.logout().then(() => {
      state.token = null
      state.userInfo = null
      state.roles = []
      removeUserInfo()
      removeToken()
      removeRoles()
      router.replace("/login")
    })
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { stuNum, pwd } = userInfo
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
          commit('SET_ROLES', data.roles)
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
  logout({ commit }) {
    commit('LOGOUT')
  },
  updateUserInfo({ commit }, newUserInfo) {
    commit('SET_USER_INFO', newUserInfo)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

