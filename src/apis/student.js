import request from '@/utils/request'

export function studentAddList(addListForm) {
    return request({
        url: '/student/addList', method: 'POST', data: {
            studentList: addListForm.studentList
        }
    })
}

export function studentQueryPage(queryPageForm) {
    return request({
        url: '/student/queryPage', method: 'GET', params: {
            studentNumber: queryPageForm.studentNumber,
            name: queryPageForm.name,
            classNumber: queryPageForm.classNumber,
            type: queryPageForm.type,
            page: queryPageForm.page,
            pageSize: queryPageForm.pageSize
        }
    })
}

export function studentDeleteById(deleteByIdForm) {
    return request({
        url: '/student/deleteById/' + deleteByIdForm.id, method: 'DELETE'
    })
}

export function studentDeleteByIds(deleteByIdsForm) {
    return request({
        url: '/student/deleteByIds/' + deleteByIdsForm.ids, method: 'DELETE'
    })
}

export function studentSetType(setTypeForm) {
    return request({
        url: '/student/setType', method: 'PUT', data: {
            id: setTypeForm.id, type: setTypeForm.type
        }
    })
}