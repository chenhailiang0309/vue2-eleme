import Vue from 'vue'
import Router from 'vue-router'
const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const city = r => require.ensure([], () => r(require('../page/city/city')), 'city')

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/',redirect: '/home'},
    {path: '/home',name: 'home',component: home},
    {path: '/city/:cityid',name: 'city',component: city},
  ]
})
