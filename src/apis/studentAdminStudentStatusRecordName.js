import request from '@/utils/request'

export function studentAdminStudentStatusRecordNameGetByStudentAdminStudentStatusrRecordDateId(getByStudentAdminStudentStatusrRecordDateIdForm) {
    return request({
        url: '/studentAdminStudentStatusRecordName/getByStudentAdminStudentStatusrRecordDateId/' + getByStudentAdminStudentStatusrRecordDateIdForm.studentAdminStudentStatusrRecordDateId,
        method: "GET"
    })
}