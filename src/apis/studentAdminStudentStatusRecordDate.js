import request from '@/utils/request'

export function studentAdminStudentStatusRecordDateGetByNowTimeWithStudentAdminStudentStatusRecordByStudentId(getByNowTimeWithStudentAdminStudentStatusRecordByStudentIdForm) {
    return request({
        url: '/studentAdminStudentStatusRecordDate/getByNowTimeWithStudentAdminStudentStatusRecordByStudentId/' + getByNowTimeWithStudentAdminStudentStatusRecordByStudentIdForm.studentId,
        method: 'GET'
    })
}