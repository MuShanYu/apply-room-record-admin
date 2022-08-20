import request from '@/utils/request'


export default {
  userAccessRecordListAdminApi(query) {
    return request({
      url: '/admin/record/query/list',
      method: 'get',
      params: {
        page: query.page,
        size: query.size,
        userId: query.userId
      }
    })
  },
  userAccessCountAdminApi(query) {
    return request({
      url: '/admin/record/query/list/count',
      method: 'get',
      params: {
        page: query.page,
        size: query.size,
        userId: query.userId
      }
    })
  },

  delRecord(accessRecordId) {
    return request({
      url: '/admin/record/delete/' + accessRecordId,
      method: 'get'
    })
  },
}