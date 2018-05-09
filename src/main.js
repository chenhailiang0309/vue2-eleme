// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'

// 静态资源
import './config/rem'
import './style/common.scss'

import axios from 'axios'
Vue.prototype.$http = axios

// 第三方插件
import FastClick from 'fastclick'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

Vue.config.productionTip = false

/*router.beforeEach((to, from, next) => {
  store.state.isLoading = false;
  next()
})

router.afterEach((to, from) => {
  store.state.isLoading = true
})
*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
