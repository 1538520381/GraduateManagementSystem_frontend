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