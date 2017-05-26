import config from './config/config.dev.json'

import app from './app'

app(config)

// TODO: generate prod credentials
// TODO: use https://github.com/robinvdvleuten/vuex-persistedstate to save vuex state to localstorage
