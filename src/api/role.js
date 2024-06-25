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

export function queryRoleGrantedUserApi(id, query) {
  return request({
    url: '/role/granted/user/' + id,
    method: 'get',
    params: {
      page: query.page,
      size: query.size,
      stuNum: query.stuNum
    }
  })
}

export function grantUserRoleApi(stuNum, roleId) {
  return request({
    url: '/role/grant/user',
    method: 'put',
    params: {
      stuNum: stuNum,
      roleId: roleId
    }
  })
}

export function cancelRoleGrantApi(data) {
  return request({
    url: '/role/cancel/grant',
    method: 'delete',
    data: data
  })
}

export function queryRoleByUserIdApi(userId) {
  return request({
    url: '/role/get/by-user-id',
    method: 'get',
    params: {
      userId
    }
  })
}

export function grantRoleToUserBatchApi(data) {
  return request({
    url: '/role/grant/user/batch',
    method: 'post',
    data: data
  })
}
