import request from '@/utils/request'

export function adminLogin(loginForm) {
    return request({
        url: '/admin/login', method: 'POST', data: {
            account: loginForm.account, password: loginForm.password
        }
    })
}

export function adminUpdatePassword(updatePasswordForm) {
    return request({
        url: '/admin/updatePassword', method: 'PUT', data: {
            password: updatePasswordForm.password
        }
    })
}