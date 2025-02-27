import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

export const constantRoutes = [{path: '/', redirect: '/login', hidden: true},

    {
        path: '/login', name: 'Login', component: () => import('@/views/login'),
    },

    {
        path: '/studentManagement',
        name: 'StudentManagement',
        component: () => import('@/views/admin/studentManagement')
    }, {
        path: '/studentAdminManagement',
        name: 'StudentAdminManagement',
        component: () => import('@/views/admin/studentAdminManagement')
    }, {
        path: '/studentStatusRecord',
        name: 'StudentStatusRecord',
        component: () => import('@/views/admin/studentStatusRecord')
    }, {
        path: '/studentStatusRecordDetail',
        name: 'StudentStatusRecordDetail',
        component: () => import('@/views/admin/studentStatusRecordDetail')
    }, {
        path: '/internshipApplicationManagement',
        name: 'InternshipApplicationManagement',
        component: () => import('@/views/admin/internshipApplicationManagement')
    },

    {
        path: '/teamMemberManagement',
        name: 'TeamMemberManagement',
        component: () => import('@/views/studentAdmin/teamMemberManagement')
    },

    {
        path: '/student/login', name: 'StudentLogin', component: () => import('@/views/student/login')
    }, {
        path: '/student/home', name: 'StudentHome', component: () => import('@/views/student/home')
    }, {
        path: '/student/internshipApplication',
        name: 'StudentInternshipApplication',
        component: () => import('@/views/student/internshipApplication')
    }, {
        path: '/student/questionnaire',
        name: 'StudentQuestionnaire',
        component: () => import('@/views/student/questionnaire')
    }]

const createRouter = () => new VueRouter({
    routes: constantRoutes, mode: 'history'
})

const router = createRouter()

export default router;
