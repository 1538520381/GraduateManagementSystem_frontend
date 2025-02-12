import request from '@/utils/request'

export function internshipApplicationAdd(addForm) {
    return request({
        url: '/internshipApplication/add', method: 'POST', data: {
            studentId: addForm.studentId,
            internshipStartTime: addForm.internshipStartTime,
            internshipEndTime: addForm.internshipEndTime,
            internshipUnit: addForm.internshipUnit,
            offCampusHousingFlag: addForm.offCampusHousingFlag,
            internshipApplicationFormDocumentId: addForm.internshipApplicationFormDocumentId,
            parentalNotificationLetterDocumentId: addForm.parentalNotificationLetterDocumentId
        }
    })
}

export function internshipApplicationListByStudentId(listByStudentIdForm) {
    return request({
        url: '/internshipApplication/listByStudentIdWithDocumentSortByCreateTime/' + listByStudentIdForm.studentId,
        method: 'GET',
    })
}

export function internshipApplicationUpdateById(updateByIdForm) {
    return request({
        url: '/internshipApplication/updateById', method: 'PUT', data: {
            id: updateByIdForm.id, status: updateByIdForm.status
        }
    })
}