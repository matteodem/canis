import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// TODO: add simple view state logic (home, mentions, tags, search?)
// TODO: display vuex view state (feed)
// TODO: make it clear in the UI that it only works for mastodon.social now
// TODO: Make api endpoint configurable in UI (so that people could host their own Proxy API)
export default new Vuex.Store({
  plugins: [createPersistedState({
    key: 'mastoviewrState'
  })],
  state: {
    accessToken: '',
    isLoggedIn: false,
  },
  mutations: {
    setAccessToken(state, token) {
      state.isLoggedIn = !!token
      state.accessToken = token
    },
    removeAccessToken(state) {
      state.isLoggedIn = false
      state.accessToken = ''
    },
  },
  actions: {
    finishLogin({ commit }, token) {
      commit('setAccessToken', token)
    },
    logOut({ commit }) {
      commit('removeAccessToken')
    },
  },
})
