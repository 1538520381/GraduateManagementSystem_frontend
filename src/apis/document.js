import request from '@/utils/request'

export function documentUpload(uploadForm) {
    return request({
        url: '/document/upload', method: 'POST', headers: {
            'Content-Type': 'multipart/form-data',
        }, data: {
            document: uploadForm.document
        }
    })
}