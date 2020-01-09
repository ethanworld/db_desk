<template>
<div class="Login">
    <div class="title">电网主辅设备主动预警系统</div>
    <div class="img"></div>
    <div class="content">
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="100px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginForm.password"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handlePost('loginForm')">
                    登录
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: null,
        password: null
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 监听登录结果
    this.$electron.ipcRenderer.on('getLoginRes', (e, info) => {
      setTimeout(() => {
        if (info['username'] !== info.username) {
          this.$notify.error('账户或密码错误！')
          return false
        } else {
          this.$notify.success('登录成功 ！')
          this.$store.commit('setAuth', info)
          this.$router.push({name: 'DataIndex'})
          return true
        }
      }, 2000)
    })
  },
  methods: {
    handlePost (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$electron.ipcRenderer.send('login', this.loginForm)
        } else {
          this.$notify.error('登录出错了！')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
    .Login{
        width: 544px;
        margin: 0 auto;
        padding-top: 100px;
        .title{
            font-size: 35px;
            font-weight: bolder;
            letter-spacing: 5px;
            text-align: center;
            width: 100%;
        }
        .img{
            margin: 50px auto;
            /* w/h = 2.33*/
            width: 100%;
            height: 233px;
            background: url("../assets/login_bg.jpg") no-repeat 0 3px;
            background-size:100% 100%;
        }
        .content{
            width: 100%;
            height: 400px;
        }
        .el-input, .el-button{
            width: 80%;
        }
        .el-button{
            background: #016F69;
            border: 0;
            &:hover{
                background: #217346;
            }
        }
    }
</style>
