import request from '@/utils/request'

export function studentAdminStudentStatusRecordDateGetByNowTimeWithStudentAdminStudentStatusRecordByStudentId(getByNowTimeWithStudentAdminStudentStatusRecordByStudentIdForm) {
    return request({
        url: '/studentAdminStudentStatusRecordDate/getByNowTimeWithStudentAdminStudentStatusRecordByStudentId/' + getByNowTimeWithStudentAdminStudentStatusRecordByStudentIdForm.studentId,
        method: 'GET'
    })
}

export function studentAdminStudentStatusRecordDateGetList() {
    return request({
        url: "/studentAdminStudentStatusRecordDate/getList", method: "GET"
    })
}

export function studentAdminStudentStatusRecordDateGetPage(getPageForm) {
    return request({
        url: '/studentAdminStudentStatusRecordDate/getPage', method: "GET", params: {
            page: getPageForm.page, pageSize: getPageForm.pageSize
        }
    })
}

export function studentAdminStudentStatusRecordDateDeleteById(deleteByIdForm) {
    return request({
        url: '/studentAdminStudentStatusRecordDate/deleteById/' + deleteByIdForm.id, method: 'DELETE'
    })
}

export function studentAdminStudentStatusRecordDateAdd(addForm) {
    return request({
        url: '/studentAdminStudentStatusRecordDate/add', method: 'POST', data: {
            startTime: addForm.startTime,
            endTime: addForm.endTime,
            semester: addForm.semester,
            week: addForm.week,
            problems: addForm.problems
        }
    })
}

export function studentAdminStudentStatusRecordDateGetById(getByIdForm) {
    return request({
        url: '/studentAdminStudentStatusRecordDate/getById/' + getByIdForm.id, method: 'GET'
    })
}