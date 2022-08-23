import request from '@/utils/request'

export default {
  querySysConfigByKeyApi(key) {
    return request({
      url: '/config/get/by/' + key,
      method: 'get'
    })
  },
  addConfigApi(sysConfigAddDTO) {
    return request({
      url: '/config/post/add',
      method: 'post',
      data: sysConfigAddDTO
    })
  },
  updateSysConfigApi(sysConfig) {
    return request({
      url: '/config/post/update',
      method: 'post',
      data: sysConfig
    })
  },
  querySysConfigListApi(page, size) {
    return request({
      url: '/config/get/list',
      method: 'get',
      params: {
        page,
        size
      }
    })
  },
  delSysConfigApi(id) {
    return request({
      url: '/config/del/' + id,
      method: 'get'
    })
  },
}
