import request from '@/utils/request'

export function studentAdminStudentStatusRecordUpdate(studentAdminStudentStatusRecordUpdateForm) {
    return request({
        url: '/studentAdminStudentStatusRecord/update', method: 'PUT', data: {
            studentAdminId: studentAdminStudentStatusRecordUpdateForm.studentAdminId,
            studentId: studentAdminStudentStatusRecordUpdateForm.studentId,
            studentAdminStudentStatusRecordDateId: studentAdminStudentStatusRecordUpdateForm.studentAdminStudentStatusRecordDateId,
            onCampusFlag: studentAdminStudentStatusRecordUpdateForm.onCampusFlag,
            leavingSchoolDetails: studentAdminStudentStatusRecordUpdateForm.leavingSchoolDetails,
            scientificResearchProgress: studentAdminStudentStatusRecordUpdateForm.scientificResearchProgress,
            personalityTraits: studentAdminStudentStatusRecordUpdateForm.personalityTraits,
            abnormalIssues: studentAdminStudentStatusRecordUpdateForm.abnormalIssues,
        }
    })
}

export function studentAdminStudentStatusRecordGetStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate(getStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDateForm) {
    return request({
        url: '/studentAdminStudentStatusRecord/getStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDate/' + getStudentAdminStudentStatusRecordByStudentIdToNowWithStudentAdminStudentStatusRecordDateForm.studentId,
        method: 'GET'
    })
}