import request from '@/utils/request'

export function studentQuestionnaireAnswerAddList(addListForm) {
    return request({
        url: '/studentQuestionnaireAnswer/addList', method: 'POST', data: {
            studentQuestionnaireAnswerList: addListForm.studentQuestionnaireAnswerList
        }
    })
}