import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

export const constantRoutes = [{path: '/', redirect: '/student/login', hidden: true},

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
        path: '/student/internshipApplication', name: 'StudentInternshipApplication', component: () => import('@/views/student/internshipApplication')
    }]

const createRouter = () => new VueRouter({
    routes: constantRoutes, mode: 'history'
})

const router = createRouter()

export default router;
