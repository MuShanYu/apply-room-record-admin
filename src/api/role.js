import request from '@/utils/request'

export function getRoleListApi(queryParams) {
  return request({
    url: '/role/get/list',
    method: 'get',
    params: {
      page: queryParams.page,
      size: queryParams.size,
      roleDes: queryParams.roleDes
    }
  })
}

export function saveRoleApi(role) {
  return request({
    url: '/role/save',
    method: 'post',
    data: role
  })
}

export function updateRoleApi(role) {
  return request({
    url: '/role/update',
    method: 'put',
    data: role
  })
}

export function delRoleApi(id) {
  return request({
    url: '/role/del/' + id,
    method: 'delete'
  })
}
