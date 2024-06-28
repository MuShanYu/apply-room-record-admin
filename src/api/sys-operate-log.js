import request from '@/utils/request'

export function getSysOperateListApi(params) {
  return request({
    url: '/admin/sys-log/query/list',
    method: 'post',
    data: params
  })
}

export function delLogApi(ids) {
  return request({
    url: '/admin/sys-log/del',
    method: 'delete',
    data: ids
  })
}
