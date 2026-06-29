import Vue from 'vue'
import App from './App.vue'
import tooltip from './directives/tooltip'

Vue.config.productionTip = false

// Register globally — v-tooltip is now available in every component
Vue.directive('tooltip', tooltip)

new Vue({
  render: h => h(App),
}).$mount('#app')
