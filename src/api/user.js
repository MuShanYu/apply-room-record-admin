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
  refreshToken(userId) {
    return request({
      url: '/user/refreshToken',
      method: 'get',
      params: {
        userId
      }
    })
  },
  userList(userListQueryDTO) {
    return request({
      url: '/admin/userList',
      method: 'post',
      data: userListQueryDTO
    })
  }
}
