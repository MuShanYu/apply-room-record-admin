import {getBuiltMenuApi} from "@/api/sys-menu";
import router, {constantRoutes, dynamicRoutes} from '@/router'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import {getDayCountOfMonth} from "element-ui";
import {load} from "runjs/lib/script";

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topBarRouters: [],
    sidebarRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOP_BAR_ROUTES: (state, routes) => {
      state.topBarRouters = routes
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({commit}) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getBuiltMenuApi().then(res => {
          let routes = [...res];
          routes.forEach(item => {
            item.children = loadRouteChildren(item.children)
            item.component = loadComponent(item.component)
          })
          commit('SET_ROUTES', routes)
          // commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(routes))
          resolve(routes)
        })
      })
    }
  }
}

function loadRouteChildren(children) {
  children.forEach(v => {
    v.component = loadComponent(v.component)
    if (v.children) {
      v.children = loadRouteChildren(v.children)
    }
  })
  return children
}

function loadComponent(component) {
  if (component) {
    // Layout ParentView 组件特殊处理
    if (component === 'Layout') {
      return Layout
    } else if (component === 'ParentView') {
      return ParentView
    } else {
      return loadView(component)
    }
  }
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`)
  }
}

export default permission
