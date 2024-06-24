import request from '@/utils/request'

export default {
  getOnlineUserApi() {
    return request({
      url: '/admin/get/online/users',
      method: 'get'
    })
  },
  login(userLoginDTO) {
    return request({
      url: '/admin/login',
      method: 'post',
      data: userLoginDTO
    })
  },
  logout() {
    return request({
      url: '/user/logout',
      method: 'get'
    })
  },
  userList(userListQueryDTO) {
    return request({
      url: '/admin/query/userList',
      method: 'post',
      data: userListQueryDTO
    })
  },
  batchInsertUser(registerDTOS) {
    return request({
      url: '/admin/batchInsert/users',
      method: 'post',
      data: registerDTOS
    })
  },
  changeRole(userRoleChangeDTO) {
    return request({
      url: '/admin/update/role',
      method: 'post',
      data: userRoleChangeDTO
    })
  },
  updateUserName(userUpdateNameDTO) {
    return request({
      url: '/admin/update/user/name',
      method: 'post',
      data: userUpdateNameDTO
    })
  },
  updateUserInfo(userUpdateDTO) {
    return request({
      url:'/user/update/userInfo',
      method:'post',
      data: userUpdateDTO
    })
  }
}

export function getUserPermissionAndRole() {
  return request({
    url: '/user/get/auth',
    method: 'get'
  })
}
