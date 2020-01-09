import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'
import { createPersistedState } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState()
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== 'production',
  state: {
    root: 'http://localhost:8000/api/',
    rootStatic: 'http://localhost:8000/static/files/',
    auth: JSON.parse(localStorage.getItem('auth')) || null,
    categories: JSON.parse(localStorage.getItem('categories')) || null
  },
  mutations: {
    clear (state) {
      localStorage.removeItem('categories')
      state.categories = null
    },
    setAuth (state, auth) {
      localStorage.setItem('auth', JSON.stringify(auth))
      state.auth = JSON.parse(localStorage.getItem('auth'))
    },
    removeAuth (state) {
      localStorage.removeItem('auth')
      state.auth = null
      history.go(0)
    },
    setCategories (state, categories) {
      localStorage.setItem('categories', JSON.stringify(categories))
      state.categories = JSON.parse(localStorage.getItem('categories'))
    },
    removeCategories (state) {
      localStorage.removeItem('categories')
      state.categories = null
    }
  }
})
