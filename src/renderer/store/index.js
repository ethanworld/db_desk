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
    rootStatic: 'D:\\proj_db\\files\\',
    auth: JSON.parse(localStorage.getItem('auth')) || null,
    categories: JSON.parse(localStorage.getItem('categories')) || null
  },
  mutations: {
    clear (state) {
      localStorage.removeItem('categories')
      state.categories = null
    },
    setRootStatic (state, rootStatic) {
      localStorage.setItem('rootStatic', JSON.stringify(rootStatic))
      state.rootStatic = JSON.parse(localStorage.getItem('rootStatic'))
    },
    setAuth (state, auth) {
      localStorage.setItem('auth', JSON.stringify(auth))
      state.auth = JSON.parse(localStorage.getItem('auth'))
    },
    removeAuth (state) {
      console.log('remove auth')
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
      console.log('remove category')
      state.categories = null
    }
  }
})
