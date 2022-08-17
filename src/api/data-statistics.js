import request from '@/utils/request'

export default {
  getRoomClassifyInfo() {
    return request({
      url: '/user/get/classify/room',
      method: 'get'
    })
  },
  getInstituteClassifyInfo() {
    return request({
      url: '/admin/get/classify/institute',
      method: 'get'
    })
  },
}
