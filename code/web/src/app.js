import 'tachyons'
import Vue from 'vue'
import App from './App.vue'
import './styles/styles.scss'
import store from './store'

export default function ({ apiEndpoint }) {
  Vue.use({
    install: function (Vue) {
      Vue.prototype.mastodonApiEndpoint = apiEndpoint
    },
  })

  new Vue({
    el: '#app',
    ...App,
    store,
    propsData: {
      apiEndpoint,
    }
  })
}
