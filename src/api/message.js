import request from '@/utils/request'

export function sendMessageApi(message) {
  return request({
    url: '/message/add',
    method: 'post',
    data: message
  })
}
