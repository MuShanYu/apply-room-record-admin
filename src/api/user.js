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
      url: '/user/login',
      method: 'post',
      data: userLoginDTO
    })
  }
}
