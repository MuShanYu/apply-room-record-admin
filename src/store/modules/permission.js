import { constantRoutes } from '@/router'
import {getBuiltMenuApi} from "@/api/sys-menu";
import Layout from '@/layout/index'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 生成路由
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      // 向后端请求路由数据
      getBuiltMenuApi().then(res => {
        if (res) {
          const rewriteRoutes = filterAsyncRouter(res)
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', rewriteRoutes)
          resolve(rewriteRoutes)
        } else {
          const rewriteRoutes = [{ path: '*', redirect: '/404', hidden: true }]
          commit('SET_ROUTES', rewriteRoutes)
          resolve(rewriteRoutes)
        }
      })
    })
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component !== '' && route.component !== null) {
      // Layout 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
        // 首组件前加上/
        route.path = '/' + route.path
      } else {
        route.component = loadView(route.component)
      }
    }
    // 这个组件是否还有组件，有就进行递归 第二个的值可能为undefined
    if (route.children !== null && route.children && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children)
    } else {
      // 没有孩子了就删除一些属性
      delete route['children']
      // 删除子节点 isAlwaysShow属性
      delete route['alwaysShow']
    }
    // 删除一些不用属性
    delete route['parentId']
    delete route['orderNum']
    delete route['id']
    delete route['isLink']
    delete route['menuType']
    return true
  })
}

export const loadView = (view) => { // 路由懒加载
                                    // console.log(view)
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
