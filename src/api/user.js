import request from '@/utils/request'

export default {
  getPublicKey(currentTimeMills) {
    return request({
      url: '/user/publicKey',
      method: 'get',
      params: {
        currentTimeMills
      }
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
  updateUserTel(userUpdateTelDTO) {
    return request({
      url: '/admin/update/user/tel',
      method: 'post',
      data: userUpdateTelDTO
    })
  },
  updateUserName(userUpdateNameDTO) {
    return request({
      url: '/admin/update/user/name',
      method: 'post',
      data: userUpdateNameDTO
    })
  }
}
