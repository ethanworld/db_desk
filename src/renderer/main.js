import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import electron from 'electron'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入nprogress
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 这个样式必须引入
import plTable from 'pl-table'
import 'pl-table/themes/index.css' // 引入样式（必须引入)，请查看webpack是否配置了url-loader对woff，ttf文件的引用,不配置会报错哦
import 'pl-table/themes/plTableStyle.css' // 默认表格样式很丑 引入这个样式就可以好看啦（如果你不喜欢这个样式，就不要引入，不引入就跟ele表格样式一样）

Vue.use(plTable)
Vue.use(ElementUI)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.requireAuth) { // 判断跳转的路由是否需要登录
    if (store.state.auth) { // vuex.state判断token是否存在
      next() // 已登录
    } else {
      next({
        name: 'Login',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  if (store.state.categories === null) {
    // 监听计算结果
    electron.ipcRenderer.on('getNodeListRes', (e, info) => {
      // this.$electron.ipcRenderer.send('state')
      setTimeout(() => {
        // categories 需要是数组
        store.commit('setCategories', [info])
      }, 2000)
    })
    // 获取目录
    electron.ipcRenderer.send('getNodeList')
  }
  next()
})
router.afterEach(() => {
  NProgress.done()
})
let openDelay = false
Vue.directive('intervalclick', function (el, binding) {
  el.onclick = function (e) {
    if (openDelay) return
    openDelay = !openDelay
    if (!binding.value) {
      alert('未传入Value数据！')
      return
    }
    let func = binding.value['func']
    let time = binding.value['time']
    if (typeof time !== 'number') {
      alert('传入等待时间错误')
      return
    }
    let args = []
    for (const key in binding.value) {
      if (binding.value.hasOwnProperty(key)) {
        if (key === 'func' || key === 'time') continue
        args.push(binding.value[key])
      }
    }
    setTimeout(() => {
      openDelay = !openDelay
    }, time)
    func(...args)
  }
})
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
