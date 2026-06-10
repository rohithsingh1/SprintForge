import {createRouter, createWebHistory} from "vue-router"
import RegisterView from "./views/RegisterView.vue"
import LoginView from "./views/LoginView.vue"

const routes=[
    {
        path: '/',
        redirect: '/login'
    },
    {path: '/register', component: RegisterView, meta: {title: 'Create Account'}},
    {path: '/login', component: LoginView, meta: {title: 'Sign In'}}
]

const router=createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach((to) => {
    document.title=to.meta.title? `${to.meta.title} - NextWave`:'NextWave'
})

export default router