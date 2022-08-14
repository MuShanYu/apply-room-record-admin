import request from '@/utils/request'
import { Message } from 'element-ui'


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
      url: '/admin/query/userList',
      method: 'post',
      data: userListQueryDTO
    })
  },
  changeRole(userRoleChangeDTO) {
    return request({
      url: '/admin/update/role',
      method: 'post',
      data: userRoleChangeDTO
    })
  }
}
