import request from '@/utils/request'

export default {
    addNotice(notice) {
        return request({
            url: 'notice/save',
            method: 'post',
            data: notice
        })
    },
    noticeList(noticeQueryDTO) {
        return request({
            url: '/notice/query/admin/list',
            method: 'post',
            data: noticeQueryDTO
        })
    },
    updateNotice(notice) {
        return request({
            url: '/notice',
            method: 'put',
            data: notice
        })
    },
    delNotice(noticeId) {
        return request({
            url: '/notice',
            method: 'delete',
            params: { noticeId }
        })
    },
    resetNotice(noticeId) {
        return request({
            url: '/notice/reset',
            method: 'put',
            params: { noticeId },
        })
    }
}
