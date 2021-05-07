// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import * as echarts from 'echarts'
import { 
  Button,
  Icon,
  message,
} from 'ant-design-vue'

import App from './App'
import router from './router'
Vue.component(Button.name, Button)
Vue.component(Icon.name, Icon)

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$message = message;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
