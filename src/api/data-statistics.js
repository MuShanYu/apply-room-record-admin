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

  countRoomReservationTimes(roomId, startTime) {
    return request({
      url: '/admin/get/roomReservationTimes',
      method: 'get',
      params: {
        roomId,
        startTime
      }
    })
  },
  searchRoomByName(roomName) {
  return request({
    url: '/admin/get/search/roomName',
    method: 'get',
    params: {
      roomName
    }
  })
},
}
