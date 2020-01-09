<template>
	<div class="UserManage">
    <div class="Wrapper">
      <el-button @click="handleEdit()" type="success">
        新增用户
      </el-button>
      <el-divider></el-divider>
      <el-table
          :data="userList"
          style="width: 100%">
        <el-table-column
            label="用户名">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column
            label="密码">
          <template slot-scope="scope">
            {{ scope.row.password }}
          </template>
        </el-table-column>
        <el-table-column
            label="管理员">
          <template slot-scope="scope">
            <i class="el-icon-user-solid" style="color: green" v-if="scope.row.isAdmin > 0"></i>
            <i class="el-icon-circle-close" style="color: gray" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="查看权限">
          <template slot-scope="scope">
            <i class="el-icon-success" style="color: green" v-if="scope.row.watch > 0"></i>
            <i class="el-icon-circle-close" style="color: gray" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="上传权限">
          <template slot-scope="scope">
            <i class="el-icon-success" style="color: green" v-if="scope.row.upload > 0"></i>
            <i class="el-icon-circle-close" style="color: gray" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="下载权限">
          <template slot-scope="scope">
            <i class="el-icon-success" style="color: green" v-if="scope.row.download > 0"></i>
            <i class="el-icon-circle-close" style="color: gray" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="删除权限">
          <template slot-scope="scope">
            <i class="el-icon-success" style="color: green" v-if="scope.row.delete > 0"></i>
            <i class="el-icon-circle-close" style="color: gray" v-else></i>
          </template>
        </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                :disabled="scope.row.isAdmin > 0"
                size="mini"
                type="danger"
                @click="handleDialog(scope.row)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <el-drawer
      title="编辑用户"
      :visible.sync="drawerDisaply"
      :with-header="false">
      <el-form ref="ruleForm" :model="editUser" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="editUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="editUser.password"></el-input>
        </el-form-item>
        <el-form-item label="查看权限">
          <el-radio-group v-model="editUser.watch">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传权限">
          <el-radio-group v-model="editUser.upload">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="下载权限">
          <el-radio-group v-model="editUser.download">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除权限">
          <el-radio-group v-model="editUser.delete">
            <el-radio :label="1">支持</el-radio>
            <el-radio :label="0">不支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleSubmit()">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-dialog
      title="确定删除用户"
      :visible.sync="dialogVisible"
      width="300px">
      <el-button type="warning" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleDelete">确 定</el-button>
    </el-dialog>
	</div>
</template>

<script>
export default {
  name: 'UserManage',
  data () {
    return {
      dialogVisible: false,
      postFlag: false,
      drawerDisaply: false,
      userList: [],
      editUser: {
        id: '',
        username: '',
        password: '',
        isAdmin: '',
        upload: '',
        download: '',
        delete: '',
        watch: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.$electron.ipcRenderer.on('getUserListRes', (e, res) => {
      this.dialogVisible = false
      this.drawerDisaply = false
      this.userList = res
    })
    this.$electron.ipcRenderer.on('getAddUserRes', (e, res) => {
      this.$electron.ipcRenderer.send('userList')
      this.$message.success('新增成功')
    })
    this.$electron.ipcRenderer.on('getModifyUserRes', (e, res) => {
      this.$electron.ipcRenderer.send('userList')
      this.$message.success('修改成功')
    })
    this.$electron.ipcRenderer.on('getDeleteUserRes', (e, res) => {
      this.$electron.ipcRenderer.send('userList')
      this.$message.success('删除成功')
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$electron.ipcRenderer.send('userList')
    })
  },
  methods: {
    handleEdit (row) {
      if (row === undefined) {
        this.editUser = {
          id: '',
          username: '',
          password: '',
          isAdmin: 0,
          upload: 0,
          download: 0,
          delete: 0,
          watch: 0
        }
        this.drawerDisaply = true
        this.postFlag = true
        return
      }
      this.postFlag = false
      this.editUser = JSON.parse(JSON.stringify(row))
      this.drawerDisaply = true
    },
    handleDialog (row) {
      this.editUser = row
      this.dialogVisible = true
    },
    handleDelete () {
      this.$electron.ipcRenderer.send('deleteUser', this.editUser.id)
    },
    handleSubmit () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let istExist = false
          this.userList.forEach(user => {
            if (user['id'] !== this.editUser.id && user['username'].trim() === this.editUser.username.trim()) {
              this.$message.warning('用户名已存在')
              istExist = true
              return false
            }
          })
          if (istExist) {
            return false
          }
          if (this.postFlag) {
            this.$electron.ipcRenderer.send('addUser', this.editUser)
          } else {
            this.$electron.ipcRenderer.send('modifyUser', this.editUser)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .UserManage{
    .Wrapper{
      margin: 50px auto;
      width: 1200px;
      height: 500px;
    }
    i {
      font-weight: bolder;
      font-size: larger;
    }
    .el-drawer{
      padding: 20px!important;
    }
  }
</style>