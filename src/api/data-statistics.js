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

  searchRoomByName(roomName) {
    return request({
      url: '/admin/get/search/roomName',
      method: 'get',
      params: {
        roomName
      }
    })
  },
  getSystemCount() {
    return request({
      url: '/admin/get/sys/count',
      method: 'get'
    })
  },
  countRoomReservationTimes(query) {
    return request({
      url: '/admin/get/roomReservationTimes/count',
      method: 'get',
      params: {
        roomId: query.roomId,
        startTime: query.startTime
      }
    })
  },
  countAccessRecordApi(query) {
    return request({
      url: '/admin/get/access/record/count',
      method: 'get',
      params: {
        roomId: query.roomId,
        startTime: query.startTime
      }
    })
  },
}
