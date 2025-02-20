import request from '@/utils/request'

export function questionnaireGetListWithStudentQuestionnaireAnswerByStudentId(getListWithStudentQuestionnaireAnswerByStudentIdForm) {
    return request({
        url: '/questionnaire/getListWithStudentQuestionnaireAnswerByStudentId/' + getListWithStudentQuestionnaireAnswerByStudentIdForm.studentId,
        method: 'POST'
    })
}

export class questionnaireAddList {
}