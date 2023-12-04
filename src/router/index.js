import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true
  },

  {
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
      meta: {title: '首页', icon: 'dashboard', affix: true, noCache: false}
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
        meta: {title: '公告管理', icon: 'notice', noCache: true}
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
        meta: {title: '房间列表', noCache: true}
      },
      {
        path: 'approve',
        name: 'RoomApprove',
        component: () => import('@/views/room/approve/room-approve'),
        meta: {title: '预约申请审批', noCache: true}
      },
      {
        path: 'import',
        name: 'RoomImport',
        component: () => import('@/views/room/import/import-room'),
        meta: {title: '导入房间数据', activeMenu: '/room/list'},
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
        meta: {title: '用户管理', icon: 'user', noCache: true}
      },
      {
        path: 'import',
        name: 'UserImport',
        component: () => import('@/views/user/import/import-user'),
        meta: {title: '导入用户数据', activeMenu: '/user/index'},
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
    path: '/config',
    component: Layout,
    name: 'ConfigM',
    meta: {title: '配置'},
    children: [{
      path: 'index',
      name: 'Config',
      component: () => import('@/views/config/index'),
      meta: {title: '配置管理', icon: 'config', noCache: true}
    }]
  },
  {
    path: 'h5-client',
    component: Layout,
    children: [
      {
        path: 'https://www.mushanyu.xyz:8800/#/',
        meta: {title: 'H5客户端', icon: 'link'}
      }
    ]
  },
  {
    path: 'qrcode-link',
    component: Layout,
    children: [
      {
        path: 'https://cn.online-qrcode-generator.com/',
        meta: {title: '自定义二维码生成', icon: 'link'}
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
