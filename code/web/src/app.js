import 'tachyons'
import qs from 'qs'
import Vue from 'vue'
import App from './App.vue'
import './styles/styles.scss'
import store from './store'

export default function () {
  if (window.location.href.includes('code=')) {
    const [baseUri, strParams] = window.location.href.split('?')
    const { code } = qs.parse(strParams)

    store.dispatch('registerAccessToken', { code, baseUri })
  }

  store.dispatch('validateAccessToken')

  new Vue({
    el: '#app',
    ...App,
    store,
  })
}
