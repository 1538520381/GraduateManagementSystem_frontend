import request from '@/utils/request'

export function studentAdminStudentChoiceTeamMember(choiceTeamMemberForm) {
    return request({
        url: '/studentAdminStudent/choiceTeamMember', method: 'POST', data: {
            studentAdminId: choiceTeamMemberForm.studentAdminId, studentId: choiceTeamMemberForm.studentId
        }
    })
}

export function studentAdminStudentDeleteTeamMemberByStudentId(deleteTeamMemberByStudentIdForm) {
    return request({
        url: '/studentAdminStudent/deleteTeamMemberByStudentId/' + deleteTeamMemberByStudentIdForm.studentId,
        method: 'DELETE',
    })
}