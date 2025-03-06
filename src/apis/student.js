import request from '@/utils/request'

export function studentAddList(addListForm) {
    return request({
        url: '/student/addList', method: 'POST', data: {
            studentList: addListForm.studentList
        }
    })
}

export function studentQueryPageWithStudentAdmin(queryPageWithStudentAdminForm) {
    return request({
        url: '/student/queryPageWithStudentAdmin', method: 'GET', params: {
            studentNumber: queryPageWithStudentAdminForm.studentNumber,
            name: queryPageWithStudentAdminForm.name,
            classNumber: queryPageWithStudentAdminForm.classNumber,
            type: queryPageWithStudentAdminForm.type,
            page: queryPageWithStudentAdminForm.page,
            pageSize: queryPageWithStudentAdminForm.pageSize
        }
    })
}

export function studentDeleteById(deleteByIdForm) {
    return request({
        url: '/student/deleteById/' + deleteByIdForm.id, method: 'DELETE'
    })
}

export function studentDeleteByIds(deleteByIdsForm) {
    return request({
        url: '/student/deleteByIds/' + deleteByIdsForm.ids, method: 'DELETE'
    })
}

export function studentSetType(setTypeForm) {
    return request({
        url: '/student/setType', method: 'PUT', data: {
            id: setTypeForm.id, type: setTypeForm.type
        }
    })
}

export function studentAdminLogin(adminLoginForm) {
    return request({
        url: '/student/adminLogin', method: 'POST', data: {
            studentNumber: adminLoginForm.studentNumber, password: adminLoginForm.password
        }
    })
}

export function studentUpdatePassword(updatePasswordForm) {
    return request({
        url: '/student/updatePassword', method: 'PUT', data: {
            password: updatePasswordForm.password
        }
    })
}

export function studentForgetPassword(forgetPasswordForm) {
    return request({
        url: '/student/forgetPassword', method: 'PUT', data: {
            studentNumber: forgetPasswordForm.studentNumber,
            idNumber: forgetPasswordForm.idNumber,
            password: forgetPasswordForm.password
        }
    })
}

export function studentQueryStudentListByClassNumberWithStudentAdmin(queryStudentListByClassNumberWithStudentAdminForm) {
    return request({
        url: '/student/queryStudentListByClassNumberWithStudentAdmin', method: 'GET', params: {
            studentNumber: queryStudentListByClassNumberWithStudentAdminForm.studentNumber,
            name: queryStudentListByClassNumberWithStudentAdminForm.name,
            classNumber: queryStudentListByClassNumberWithStudentAdminForm.classNumber,
        }
    })
}

export function studentGetStudentByToken() {
    return request({
        url: '/student/getStudentByToken', method: 'GET'
    })
}

export function studentQueryListByStudentAdminId(queryListByStudentAdminIdForm) {
    return request({
        url: '/student/queryListByStudentAdminId', method: 'GET', params: {
            studentNumber: queryListByStudentAdminIdForm.studentNumber,
            name: queryListByStudentAdminIdForm.name,
            studentAdminId: queryListByStudentAdminIdForm.studentAdminId
        }
    })
}

export function studentGetClassNumberListOfStudentAdmin() {
    return request({
        url: '/student/getClassNumberListOfStudentAdmin', method: 'GET'
    })
}

export function studentLogin(loginForm) {
    return request({
        url: '/student/login', method: 'POST', data: {
            studentNumber: loginForm.studentNumber, password: loginForm.password
        }
    })
}

export function studentGetClassNumberList() {
    return request({
        url: '/student/getClassNumberList', method: 'GET'
    })
}

export function studentQueryPageWithStudentAdminStudentStatusRecord(queryPageWithStudentAdminStudentStatusRecordForm) {
    return request({
        url: "/student/queryPageWithStudentAdminStudentStatusRecord", method: 'GET', params: {
            page: queryPageWithStudentAdminStudentStatusRecordForm.page,
            pageSize: queryPageWithStudentAdminStudentStatusRecordForm.pageSize,
            semester: queryPageWithStudentAdminStudentStatusRecordForm.semester,
            week: queryPageWithStudentAdminStudentStatusRecordForm.week,
            classNumber: queryPageWithStudentAdminStudentStatusRecordForm.classNumber,
            studentNumber: queryPageWithStudentAdminStudentStatusRecordForm.studentNumber,
            name: queryPageWithStudentAdminStudentStatusRecordForm.name,
        }
    })
}

export function studentQueryListWithStudentAdminStudentStatusRecord(queryListWithStudentAdminStudentStatusRecordForm) {
    return request({
        url: "/student/queryListWithStudentAdminStudentStatusRecord", method: 'GET', params: {
            page: queryListWithStudentAdminStudentStatusRecordForm.page,
            pageSize: queryListWithStudentAdminStudentStatusRecordForm.pageSize,
            semester: queryListWithStudentAdminStudentStatusRecordForm.semester,
            week: queryListWithStudentAdminStudentStatusRecordForm.week,
            classNumber: queryListWithStudentAdminStudentStatusRecordForm.classNumber,
            studentNumber: queryListWithStudentAdminStudentStatusRecordForm.studentNumber,
            name: queryListWithStudentAdminStudentStatusRecordForm.name,
        }
    })
}
