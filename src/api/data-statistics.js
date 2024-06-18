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
  countRoomReservationTimes(roomReservationCountDTO) {
    return request({
      url: '/admin/post/roomReservationTimes/count',
      method: 'post',
      data: roomReservationCountDTO
    })
  },
  countAccessRecordApi(roomRecordCountDTO) {
    return request({
      url: '/admin/post/access/record/count',
      method: 'post',
      data: roomRecordCountDTO
    })
  },
  countRoomRecordAccessCountData(roomRecordCountDTO) {
    return request({
      url: '/admin/query/export/access/record',
      responseType: 'blob',
      method: 'post',
      data: roomRecordCountDTO
    })
  },
  getServerInfoApi() {
    return request({
      url: '/admin/query/server/info',
      method: 'get'
    })
  },
}
