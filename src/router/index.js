import Vue from "vue";
import VueRouter from "vue-router";

import Login from '@/views/login/index.vue'

import StudentManagement from "@/views/admin/studentManagement/index.vue";
import StudentAdminManagement from "@/views/admin/studentAdminManagement/index.vue";
import StudentStatusRecord from "@/views/admin/studentStatusRecord/index.vue";
import StudentStatusRecordDetail from "@/views/admin/studentStatusRecordDetail/index.vue";
import StudentStatusRecordDate from "@/views/admin/studentStatusRecordDate/index.vue";
import QuestionnaireManagement from "@/views/admin/questionnaireManagement/index.vue";
import InternshipApplicationManagement from "@/views/admin/internshipApplicationManagement/index.vue";

import TeamMemberManagement from "@/views/studentAdmin/teamMemberManagement/index.vue";

import StudentLogin from '@/views/student/login/index.vue';
import StudentHome from '@/views/student/home/index.vue';
import StudentInternshipApplication from '@/views/student/internshipApplication/index.vue'
import StudentQuestionnaire from '@/views/student/questionnaire/index.vue'

Vue.use(VueRouter)

export const constantRoutes = [{path: '/', redirect: '/login', hidden: true},

    {
        path: '/login', name: 'Login', component: Login,
    },

    {
        path: '/studentManagement', name: 'StudentManagement', component: StudentManagement
    }, {
        path: '/studentAdminManagement', name: 'StudentAdminManagement', component: StudentAdminManagement
    }, {
        path: '/studentStatusRecord', name: 'StudentStatusRecord', component: StudentStatusRecord
    }, {
        path: '/studentStatusRecordDetail', name: 'StudentStatusRecordDetail', component: StudentStatusRecordDetail
    }, {
        path: '/studentStatusRecordDate', name: 'StudentStatusRecordDate', component: StudentStatusRecordDate
    }, {
        path: '/questionnaireManagement', name: 'QuestionnaireManagement', component: QuestionnaireManagement
    }, {
        path: '/internshipApplicationManagement',
        name: 'InternshipApplicationManagement',
        component: InternshipApplicationManagement
    },

    {
        path: '/teamMemberManagement', name: 'TeamMemberManagement', component: TeamMemberManagement
    },

    {
        path: '/student/login', name: 'StudentLogin', component: StudentLogin
    }, {
        path: '/student/home', name: 'StudentHome', component: StudentHome
    }, {
        path: '/student/internshipApplication',
        name: 'StudentInternshipApplication',
        component: StudentInternshipApplication
    }, {
        path: '/student/questionnaire', name: 'StudentQuestionnaire', component: StudentQuestionnaire
    }]

const createRouter = () => new VueRouter({
    routes: constantRoutes, mode: 'history'
})

const router = createRouter()

export default router;
