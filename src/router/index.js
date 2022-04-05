import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './../components/Home.vue'
import Weclome from './../components/Weclome.vue'
import Login from './../components/Login.vue'

const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Home,
        redirect: '/weclome',
        children: [
            {
                name: 'weclome',
                path: '/weclome',
                meta: {
                    title: '欢迎页'
                },
                component: Weclome
            },
            {
                name: 'login',
                path: '/login',
                meta: {
                    title: '登陆页'
                },
                component: Login
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(), //➕ ()
    routes
})

export default router
