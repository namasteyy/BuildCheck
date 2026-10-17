import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/admin', component: () => import('@/components/AdminDashboard.vue') },
    { path: '/company', component: () => import('@/components/CompanyDashboard.vue') },
    { path: '/student', component: () => import('@/components/StudentDashboard.vue') }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
