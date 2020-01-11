import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import Article from '@/views/article'
import ArticleAdd from '@/views/articleadd'
import ArticleEdit from '@/views/articleedit'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome', // 路由重定向
    children: [
      // 欢迎页面子路由配置
      {
        path: '/welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/articleadd',
        name: 'articleadd',
        component: ArticleAdd
      },
      {
        path: '/articleedit/:aid',
        name: 'articleedit',
        component: ArticleEdit
      }
    ]
  }
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})
export default router
