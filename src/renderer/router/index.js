import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import DataViewMain from '../components/DataViewMain'
import DataIndex from '../components/DataIndex'
import DataNode from '../components/DataNode'
import UserManage from '../components/UserManage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: DataViewMain,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: '',
          name: 'DataIndex',
          meta: {
            requireAuth: true
          },
          component: DataIndex
        },
        {
          path: '/:id',
          name: 'DataNode',
          meta: {
            requireAuth: true
          },
          component: DataNode
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/manage',
      name: 'UserManage',
      component: UserManage
    }
  ]
})
