import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Menu from '@/pages/Menu'
import Layout from '@/pages/Layout'
import Banner from '@/pages/Banner'
import User from '@/pages/User'
import Specs from '@/pages/Specs'
import Seckill from '@/pages/Seckill'
import Role from '@/pages/Role'
import Goods from '@/pages/Goods'
import Category from '@/pages/Category'
import Member from '@/pages/Member'
import Index from '@/pages/Index'

Vue.use(Router)

let router = new Router({

  //路由导航
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [{
        path: 'index',
        component: Index
      }, {
        path: 'menu',
        component: Menu
      },  {
        path: 'banner',
        component: Banner
      }, {
        path: 'user',
        component: User
      }, {
        path: 'specs',
        component: Specs
      }, {
        path: 'seckill',
        component: Seckill
      }, {
        path: 'role',
        component: Role
      }, {
        path: 'goods',
        component: Goods
      },
       {
        path: 'category',
        component: Category
      },{
        path: 'member',
        component: Member
      },{
        path: '*',
        redirect: '/index'
      }]
    }
  ]
})

//导航守卫
router.beforeEach((to, from, next) => {
  let user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {//已登录
    if (to.path == '/login') {
      next(false)
    } else {
      next()
    }
  } else {//未登录
    if (to.path == '/login') {
      next()
    } else {
      next("/login")
    }
  }
})

export default router
