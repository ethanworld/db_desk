<template>
  <div id="app">
    <div id="header">
      <span style="font-weight: bolder;float: left">电网主辅设备主动预警系统</span>
      <router-link :to="{name: 'Login'}" v-if="auth === null">登录</router-link>
      <div v-else>
        <el-button type="text" @click="dialogVisible = true">
          {{auth['username']}}
        </el-button>
        <router-link :to="{name: 'UserManage'}">
          用户管理
        </router-link>
      </div>
    </div>
    <div id="main">
      <router-view/>
    </div>
    <el-dialog
            title="确定退出登录"
            :visible.sync="dialogVisible"
            width="300px">
      <el-button type="warning" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleLogout">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'db_desk',
    computed: {
      auth () {
        return this.$store.state.auth
      }
    },
    data () {
      return {
        dialogVisible: false
      }
    },
    methods: {
      handleLogout () {
        this.$store.commit('removeCategories')
        this.$store.commit('removeAuth')
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss">
  html, body, #app, .el-container{
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  #header{
    height: 40px;
    background: #016F69;
    text-align: right;
    span, a, button{
      padding: 0!important;
      margin: 0 20px!important;
      font-size: smaller;
      line-height: 40px!important;
      color: #fff;
      text-decoration: none;
      &:hover{
        color: gold;
      }
    }
    button, a{
      margin: 0 10px;
      color: #fff;
    }
  }
  #main{
    height: calc(100% - 40px);
  }
  .el-aside{
    border-right: solid 1px #eee;
  }
  .el-container, .el-main, .el-header, .el-aside, .el-footer{
    padding: 0!important;
    margin: 0!important;
  }
  #nprogress .bar {
    background: gold !important; //自定义颜色
  }
</style>
