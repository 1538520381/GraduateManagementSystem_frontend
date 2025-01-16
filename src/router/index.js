import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter)

export const constantRoutes = [{path: '/', redirect: '/login', hidden: true}, {
    path: '/login', name: 'Login', component: () => import('@/views/login'),
}, {path: '/studentImport', name: 'StudentImport', component: () => import('@/views/studentImport')}]

const createRouter = () => new VueRouter({
    routes: constantRoutes, mode: 'history'
})

const router = createRouter()

export default router;
