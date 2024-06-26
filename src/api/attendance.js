import request from '@/utils/request'

export function queryAttendanceCountList(AttendanceListQueryDTO) {
  return request({
    url: '/attendance/query/list',
    method: 'post',
    data: AttendanceListQueryDTO
  })
}

export function queryAttendanceCountDetailList(AttendanceDetailListDTO) {
  return request({
    url: '/attendance/query/detail/list',
    method: 'post',
    data: AttendanceDetailListDTO
  })
}
