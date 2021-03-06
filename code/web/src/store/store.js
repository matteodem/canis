import Vue from 'vue'
import Vuex from 'vuex'
import api from '../lib/Api'
import config from '../config/config.json'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const types = {
  home: {
    path: () => '/api/v1/timelines/home',
    streamingPath: () => '/api/v1/streaming/user',
    title: () => 'Home',
    reloadSeconds: () => 12000,
  },
  public: {
    path: () => '/api/v1/timelines/public',
    streamingPath: () => '/api/v1/streaming/public',
    title: () => 'Public',
    reloadSeconds: () => 3000,
  },
  hashtag: {
    path: (data) => `/api/v1/timelines/tag/${data.hashtag}`,
    streamingPath: (data) => `/api/v1/streaming/hashtag/?tag=${data.hashtag}`,
    title: (data) => `#${data.hashtag}`,
    reloadSeconds: () => 15000,
  }
}

const move = (arr, from, to) => arr.splice(to, 0, arr.splice(from, 1)[0])

export default new Vuex.Store({
  plugins: [createPersistedState({
    key: `${config.appName}State`,
  })],
  getters: {
    enhancedViews(state) {
      return state.views.map(view => ({
        ...view,
        ...Object.keys(types[view.type]).reduce((acc, key) => ({
          ...acc,
          [key]: types[view.type][key](view.data),
        }), {}),
      }))
    },
  },
  state: {
    clientId: '',
    clientSecret: '',
    apiEndpoint: '',
    accessToken: '',
    user: {},
    modalUrl: '',
    views: [
      { type: 'home' },
      { type: 'public' },
    ],
  },
  mutations: {
    mastodonInstanceRegistered(state, { apiEndpoint, clientId, clientSecret }) {
      state.apiEndpoint = apiEndpoint
      state.clientId = clientId
      state.clientSecret = clientSecret
    },
    mastodonInstanceResetted(state) {
      state.clientId = ''
      state.clientSecret = ''
      state.apiEndpoint = ''
    },
    accessTokenChanged(state, token) {
      state.accessToken = token
    },
    accessTokenRemoved(state) {
      state.accessToken = ''
    },
    userDataChanged(state, userData) {
      state.user = userData
    },
    viewRemoved(state, indexToRemove) {
      state.views = state.views.filter((view, viewIndex) => viewIndex !== indexToRemove)
    },
    viewAdded(state, viewData) {
      state.views.push(viewData)
    },
    viewMoved(state, { viewIndex, pos }) {
      move(state.views, viewIndex, (viewIndex + pos))
    },
    modalUrlChanged(state, url) {
      state.modalUrl = url
    },
  },
  actions: {
    adjustMastodonUri({ commit }, { usernameWithDomain, $appName }) {
      if (usernameWithDomain.includes('@')) {
        const apiEndpoint = `https://${usernameWithDomain.split('@')[1]}`.replace(/\/+$/, '')

        api(apiEndpoint).registerApp($appName).then(data => {
          const { client_id, client_secret } = data

          if (!client_id || !client_secret) {
            return alert(`Mastodon Instance not found! ${apiEndpoint}`)
          }

          commit('mastodonInstanceRegistered', {
            apiEndpoint,
            clientId: client_id,
            clientSecret: client_secret,
          })
        })
      } else {
        alert('Needs to have email like structure with @')
      }
    },
    resetMastodonUri({ commit }) {
      commit('mastodonInstanceResetted')
    },
    registerAccessToken({ commit, state }, { code, baseUri }) {
      api(state.apiEndpoint).getToken(code, state.clientId, state.clientSecret, baseUri)
        .then(data => {
          const { access_token: accessToken } = data

          commit('accessTokenChanged', accessToken)
          setTimeout(() => window.open(baseUri, '_self'), 500)
        })
    },
    validateAccessToken({ commit, state }) {
      const { accessToken, apiEndpoint } = state

      if (accessToken) {
        api(apiEndpoint).getUser(accessToken).then(user => {
          if (!user || !user.id) return commit('accessTokenRemoved')

          commit('userDataChanged', user)
        })
      }
    },
    removeView({ commit }, index) {
      commit('viewRemoved', index)
    },
    addView({ commit }, viewData) {
      commit('viewAdded', viewData)
    },
    moveView({ commit }, data) {
      commit('viewMoved', data)
    },
    openInModal({ commit }, url) {
      commit('modalUrlChanged', url)
    },
    logOut({ commit }) {
      commit('accessTokenRemoved')
    },
  },
})
