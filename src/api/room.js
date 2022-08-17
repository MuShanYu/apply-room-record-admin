import request from '@/utils/request'

export default {
  addRoom(room) {
    return request({
      url: '/room/add',
      method: 'post',
      data: room
    })
  },
  delRoom(id) {
    return request({
      url: '/room/delete',
      method: 'get',
      params: {
        id
      }
    })
  },
  roomList(roomListQueryDTO) {
    return request({
      url: '/room/queryRoomList',
      method: 'post',
      data: roomListQueryDTO
    })
  },
  updateRoom(room) {
    return request({
      url: '/room/update',
      method: 'post',
      data: room
    })
  },
  roomReservationDetail(roomApplyDetailListQueryDTO) {
    return request({
      url: '/room/queryRoomApplyDetailList',
      method: 'post',
      data: roomApplyDetailListQueryDTO
    })
  }
}
