import request from '@/utils/request'

export function questionnaireGetListWithStudentQuestionnaireAnswerByStudentId(getListWithStudentQuestionnaireAnswerByStudentIdForm) {
    return request({
        url: '/questionnaire/getListWithStudentQuestionnaireAnswerByStudentId/' + getListWithStudentQuestionnaireAnswerByStudentIdForm.studentId,
        method: 'POST'
    })
}

export function questionnaireGetPage(getPageForm) {
    return request({
        url: '/questionnaire/getPage', method: "GET", params: {
            page: getPageForm.page, pageSize: getPageForm.pageSize
        }
    })
}

export function questionnaireAdd(addForm) {
    return request({
        url: '/questionnaire/add', method: 'POST', data: {
            name: addForm.name,
            startTime: addForm.startTime,
            endTime: addForm.endTime,
            questionList: addForm.questionList
        }
    })
}

export function questionnaireDeleteById(deleteByIdForm) {
    return request({
        url: '/questionnaire/deleteById/' + deleteByIdForm.id, method: 'DELETE'
    })
}

export function questionnaireGetQuestionnaireNameList() {
    return request({
        url: '/questionnaire/getQuestionnaireNameList', method: 'GET'
    })
}

export function questionnaireGetList() {
    return request({
        url: '/questionnaire/getList', method: 'GET'
    })
}