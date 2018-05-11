import Vue from 'vue'
import Router from 'vue-router'
const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const city = r => require.ensure([], () => r(require('../page/city/city')), 'city')
const msite = r => require.ensure([], () => r(require('../page/msite/msite')), 'msite')
const shop = r => require.ensure([], () => r(require('../page/shop/shop')), 'shop')

Vue.use(Router)

export default new Router({
  strict: process.env.NODE_ENV !== 'production',
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: home },
    { path: '/city/:cityid', name: 'city', component: city },
    { path: '/msite', name: 'msite', component: msite },
    { path: '/shop', name: 'shop', component: shop }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})
