import request from '@/utils/request'

export default {
    queryAttendanceCountList(AttendanceListQueryDTO) {
    return request({
      url: '/attendance/query/list',
      method: 'post',
      data: AttendanceListQueryDTO
    })
  },
  queryAttendanceCountDetailList(AttendanceDetailListDTO) {
    return request({
      url: '/attendance/query/detail/list',
      method: 'post',
      data: AttendanceDetailListDTO
    })
  },
}
