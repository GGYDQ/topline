import Vue from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'

Vue.prototype.$http = axios
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
