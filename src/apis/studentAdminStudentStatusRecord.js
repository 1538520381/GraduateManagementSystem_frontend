import request from '@/utils/request'

export function studentAdminStudentStatusRecordUpdate(studentAdminStudentStatusRecordUpdateForm) {
    return request({
        url: '/studentAdminStudentStatusRecord/update', method: 'PUT', data: {
            studentAdminId: studentAdminStudentStatusRecordUpdateForm.studentAdminId,
            studentId: studentAdminStudentStatusRecordUpdateForm.studentId,
            studentAdminStudentStatusRecordDateId: studentAdminStudentStatusRecordUpdateForm.studentAdminStudentStatusRecordDateId,
            onCampusFlag: studentAdminStudentStatusRecordUpdateForm.onCampusFlag,
            leavingSchoolReason: studentAdminStudentStatusRecordUpdateForm.leavingSchoolReason,
            leavingSchoolDestination: studentAdminStudentStatusRecordUpdateForm.leavingSchoolDestination,
            problem1: studentAdminStudentStatusRecordUpdateForm.problem1,
            problem2: studentAdminStudentStatusRecordUpdateForm.problem2,
            problem3: studentAdminStudentStatusRecordUpdateForm.problem3,
            problem4: studentAdminStudentStatusRecordUpdateForm.problem4,
            problem5: studentAdminStudentStatusRecordUpdateForm.problem5,
            problem6: studentAdminStudentStatusRecordUpdateForm.problem6,
            problem7: studentAdminStudentStatusRecordUpdateForm.problem7,
            problem8: studentAdminStudentStatusRecordUpdateForm.problem8,
            problem9: studentAdminStudentStatusRecordUpdateForm.problem9,
            problem10: studentAdminStudentStatusRecordUpdateForm.problem10,
        }
    })
}

export function studentAdminStudentStatusRecordGetStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate(getStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDateForm) {
    return request({
        url: '/studentAdminStudentStatusRecord/getStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate/' + getStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDateForm.studentId,
        method: 'GET'
    })
}

export function studentAdminStudentStatusRecordGetLastUpdateTimeByStudentId(getLastUpdateTimeByStudentIdForm) {
    return request({
        url: '/studentAdminStudentStatusRecord/getLastUpdateTimeByStudentId/' + getLastUpdateTimeByStudentIdForm.studentId,
        method: 'GET'
    })
}