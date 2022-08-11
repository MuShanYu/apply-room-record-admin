import Layout from "@/layout/index";

export default [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [{
      path: 'index',
      name: 'UserManager',
      component: () => import('@/views/user/user'),
      meta: { title: '用户管理', icon: 'user', noCache: true }
    }]
  }
]
