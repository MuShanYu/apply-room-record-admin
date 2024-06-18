import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import fa from "element-ui/src/locale/lang/fa";

export const constantRoutes = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },

  {
    name: 'NotFound',
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/home'),
      meta: {title: '分析页', icon: 'dashboard', affix: true, noCache: false}
    }]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/index',
    children: [
      {
        path: 'index',
        name: 'NoticeManager',
        component: () => import('@/views/notice/notice'),
        meta: {title: '公告管理', icon: 'notice', noCache: false}
      }
    ]
  },
  {
    path: '/room',
    component: Layout,
    name: 'Room',
    redirect: '/room/list',
    meta: {title: '房间管理', icon: 'table'},
    children: [
      {
        path: 'list',
        name: 'RoomList',
        component: () => import('@/views/room/list/room-list'),
        meta: {title: '房间列表', noCache: false}
      },
      {
        path: 'approve',
        name: 'RoomApprove',
        component: () => import('@/views/room/approve/room-approve'),
        meta: {title: '预约审批', noCache: false}
      },
      {
        path: 'import',
        name: 'RoomImport',
        component: () => import('@/views/room/import/import-room'),
        meta: {title: '导入房间数据', activeMenu: '/room/list', noCache: false},
        hidden: true
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        name: 'UserManager',
        component: () => import('@/views/user/user'),
        meta: {title: '用户管理', icon: 'user', noCache: false}
      },
      {
        path: 'import',
        name: 'UserImport',
        component: () => import('@/views/user/import/import-user'),
        meta: {title: '导入用户数据', activeMenu: '/user/index', noCache: false},
        hidden: true
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: {title: '个人信息', noCache: true}
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    name: 'Monitor',
    redirect: '/monitor/online-user',
    meta: {title: '系统监控', icon: 'monitor'},
    children: [
      {
        path: 'online-user',
        name: 'OnlineUser',
        component: () => import('@/views/monitor/onlineUser'),
        meta: {title: '在线用户', noCache: false}
      },
      {
        path: 'server',
        name: 'Server',
        component: () => import('@/views/monitor/server'),
        meta: {title: '服务监控', noCache: false}
      },
      {
        path: 'sys-operate-log',
        name: 'SysOperateLog',
        component: () => import('@/views/monitor/sysOperateLog'),
        meta: {title: '操作日志', noCache: false}
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    name: 'ConfigM',
    meta: {title: '配置'},
    children: [{
      path: 'index',
      name: 'Config',
      component: () => import('@/views/config/index'),
      meta: {title: '配置管理', icon: 'config', noCache: false}
    }]
  },
  {
    path: '/about',
    component: Layout,
    name: "AboutM",
    meta: {title: "关于项目"},
    children: [
      {
        path: 'index',
        name: "About",
        component: () => import("@/views/about/index"),
        meta: {title: '关于项目', icon: 'link', noCache: true}
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
