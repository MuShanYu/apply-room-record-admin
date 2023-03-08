import request from '@/utils/request'

export default {
  addRoom(room) {
    return request({
      url: '/room/add',
      method: 'post',
      data: room
    })
  },
  insertRoomAndRegisterAdminUser(roomAddUpdateDTO) {
    return request({
      url: '/room/insert-and-register-admin',
      method: 'post',
      data: roomAddUpdateDTO
    })
  },
  disableRoom(id) {
    return request({
      url: '/room/disable',
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
  updateRoomCharger(roomChargerDTO) {
    return request({
      url: '/room/updateCharger',
      method: 'post',
      data: roomChargerDTO
    })
  },
  roomReservationDetail(roomApplyDetailListQueryDTO) {
    return request({
      url: '/roomReservation/queryRoomApplyDetailList',
      method: 'post',
      data: roomApplyDetailListQueryDTO
    })
  },
  userRoomReservationRecord(userRoomReservationDetailQueryDTO) {
    return request({
      url: '/roomReservation/userRecord',
      method: 'post',
      data: userRoomReservationDetailQueryDTO
    })
  },
  userRoomReservationReviewed(roomReserveReviewedDTO) {
    return request({
      url: '/roomReservation/reviewed/userRecord',
      method: 'post',
      data: roomReserveReviewedDTO
    })
  },
  passOrRejectRoomReserve(reserveId, passed, rejectReason = "") {
    return request({
      url: '/roomReservation/approval',
      method: 'get',
      params: {
        reserveId,
        passed,
        rejectReason
      }
    })
  },
  disableReserveRoom(roomId) {
    return request({
      url: '/room/disable/reserve',
      method: 'get',
      params: {
        roomId
      }
    })
  },
  delRoomReservationRecord(id) {
    return request({
      url: '/roomReservation/del/record',
      method: 'get',
      params: {
        id
      }
    })
  },
}
