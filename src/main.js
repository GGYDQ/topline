import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import '@/assets/css/base.css'
// 导入elementui模块
import ElementUI from 'element-ui'
// 注册全部的组件和事件方法
Vue.use(ElementUI)
Vue.config.productionTip = false

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
