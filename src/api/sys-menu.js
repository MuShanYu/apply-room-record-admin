import request from '@/utils/request'

export function saveMenuApi(data) {
  return request({
    url: '/sys-menu/save',
    method: 'post',
    data: data
  })
}

export function queryMenuListApi(menuName) {
  return request({
    url: '/sys-menu/query/list',
    method: 'get',
    params: {
      menuName
    }
  })
}

export function getBuiltMenuApi() {
  return request({
    url: '/user/sys-menu/query/my-grant',
    method: 'get'
  })
}

export function updateMenuApi(data) {
  return request({
    url: '/sys-menu/update',
    method: 'put',
    data: data
  })
}

export function delMenuApi(id) {
  return request({
    url: '/sys-menu/del/' + id,
    method: 'delete'
  })
}

export function getRoleMenuApi(roleId) {
  return request({
    url: '/sys-menu/query/role-menu',
    method: 'get',
    params: {
      roleId
    }
  })
}

export function grantMenuToRoleApi(data) {
  return request({
    url: '/sys-menu/grant-to-role',
    method: 'put',
    data: data
  })
}

