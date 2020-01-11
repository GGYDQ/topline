import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'

Vue.prototype.$http = axios

var JSONBig = require('json-bigint') // 需要先安装 npm i json-bigint
axios.defaults.transformResponse = [function (data) {
  // data的返回形式有两种
  // 1. 实体字符串
  // 2. 空字符串(不能转的)
  // JSONbig.parse针对大整型进行处理，其他信息不给处理
  if (data) {
    return JSONBig.parse(data)
  }
  return data
}]
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
