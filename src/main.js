import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './css/reset.css'
import axios from 'axios'
import http from './utils/request.js'
const MainColor = '#409EFF'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)
new Vue({
  render: h => h(App),
beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
