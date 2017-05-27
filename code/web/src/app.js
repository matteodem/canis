import 'tachyons'
import 'ionicons/dist/css/ionicons.css'
import 'ionicons/dist/fonts/ionicons.eot'
import 'ionicons/dist/fonts/ionicons.svg'
import 'ionicons/dist/fonts/ionicons.woff'
import qs from 'qs'
import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'

import App from './App.vue'
import './styles/styles.scss'
import store from './store/store'
import config from './config/config.json'

Vue.use(infiniteScroll)

export default function () {
  if (window.location.href.includes('code=')) {
    const [baseUri, strParams] = window.location.href.split('?')
    const { code } = qs.parse(strParams)

    return store.dispatch('registerAccessToken', { code, baseUri })
  }

  store.dispatch('validateAccessToken')

  Vue.prototype.$appName = config.appName

  new Vue({
    el: '#app',
    ...App,
    store,
  })
}
