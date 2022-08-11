import Layout from "@/layout/index";

export default [
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
        meta: {title: '房间列表'}
      },
      {
        path: 'approve',
        name: 'RoomApprove',
        component: () => import('@/views/room/approve/room-approve'),
        meta: {title: '预约审批'}
      }
    ]
  }
]
