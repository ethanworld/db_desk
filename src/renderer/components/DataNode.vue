import electron from "electron";
<template>
<div class="DataNode">
  <div class="Tips" v-if="auth['watch'] === 0">
    无查看权限
  </div>
  <div class="Tips" v-else-if="notFound === true">
    <p>文件不存在</p>
    <div v-if="node['layer'] !== 0 && auth['delete'] > 0">
      <el-button type="danger" size="medium" @click="dialogVisibleDelete = true">
        <i class="el-icon-delete"/> 删除节点
      </el-button>
    </div>
  </div>
  <!-- 下面表示有查看权限 -->
  <el-container v-else>
    <el-header>
      <div v-if="node['type'] !== 0">当前选择文件：{{node['name']}}</div>
			<div v-else>当前选择目录：{{node['name']}}</div>
    </el-header>
    <!-- 文件夹 -->
    <el-main v-if="node['type'] === nodeType.dir">
      <div class="Tips">
        <div v-if="currentFileType > this.nodeType.dir">
          选择成功
        </div>
        <div v-else>
          暂未选择文件
        </div>
      </div>
    </el-main>
    <el-main v-else-if="node['type'] === nodeType.img">
      <div class="Tips" v-if="currentImageUrl" style="padding: 20px">
        <img :src="currentImageUrl" style="max-width: 90%;max-height: 90%" alt="图片"/>
      </div>
    </el-main>
    <!-- excel -->
    <el-main v-else>
      <div class="divSearch" v-if="node['type'] !== 0">
        <el-tag type="success" effect="dark" size='medium'>
            查询结果： {{tableData.length}} 项
        </el-tag>
        <el-date-picker
            size="medium" 
            v-model="searchStart"
            type="date"
            placeholder="开始日期">
        </el-date-picker>
        <span style="color: #aaa">--</span>
        <el-date-picker
            size="medium" 
            v-model="searchEnd"
            type="date"
            placeholder="结束日期">
        </el-date-picker>
        &nbsp;&nbsp;
        <el-button size="medium" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
        </el-button>
        <el-button size="medium" type="danger" icon="el-icon-refresh" @click="handleFilterClear">
            清除条件
        </el-button>
        </div>
      <plx-table-grid id="plTable" :datas="tableData" ref="plTable" :pagination-show="false">
        <plx-table-column
          v-for="(item, key) in tableColumns"
          :fixed="key === 0 ? 'left': ''"
          :key="key"
          :prop="item"
          :label="item"
          width="160px">
        </plx-table-column>
      </plx-table-grid>
    </el-main>
    <el-footer>
      <el-row>
        <el-col :span="5" v-if="node['type'] === nodeType.dir && auth['upload'] > 0">
          <el-upload
            ref="upload"
            action="/"
            :multiple="false"
            :show-file-list="false"
            :on-change="handleFileSelect"
            :auto-upload="false">
            <el-button
                :disabled="node['type'] !== 0"
                slot="trigger"
                size="medium"
                icon="el-icon-monitor"
                type="primary">
              选择文件
            </el-button>
            </el-upload>
        </el-col>
        <el-col :span="5" v-if="node['type'] === nodeType.dir && auth['upload'] > 0">
          <el-button type="success" size="medium" v-intervalclick='{func:handleImport,time:5000,}'
                     :disabled="currentFileType === 0 || currentFileType === null">
            <i class="el-icon-upload2"/> 上传文件
          </el-button>
        </el-col>
        <el-col :span="5" v-if="node['type'] !== nodeType.dir && auth['download'] > 0">
          <el-button type="success" size="medium" v-intervalclick='{func:handleExport,time:5000,}'>
            <i class="el-icon-download"/> 导出文件
          </el-button>
        </el-col>
        <el-col :span="5" v-if="node['layer'] !== 0 && node['type'] === 0 && auth['upload'] > 0">
          <el-button type="primary" size="medium" @click="dialogVisiblePut = true">
            <i class="el-icon-edit"/> 编辑名称
          </el-button>
        </el-col>
        <el-col :span="5" v-if="node['type'] === nodeType.dir && auth['upload'] > 0">
          <el-button type="success" size="medium" @click="dialogVisiblePost = true ">
            <i class="el-icon-plus"/> 添加文件夹
          </el-button>
        </el-col>
        <!-- 根节点不显示删除 -->
        <el-col :span="4" v-if="node['layer'] !== 0 && auth['delete'] > 0">
          <el-button type="danger" size="medium" @click="dialogVisibleDelete = true">
            <i class="el-icon-delete"/> 删除节点
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
  <div class="Diaglog">
    <el-dialog
        title="编辑文件"
        :visible.sync="dialogVisiblePut"
        width="600px">
      <el-input v-model.trim="node['name']" placeholder="输入文件名称"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlePutNode">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="新增文件"
        :visible.sync="dialogVisiblePost"
        width="600px">
      <el-input v-model.trim="newNode['name']" placeholder="输入文件名称"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlePostNode">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="确定删除文件"
        :visible.sync="dialogVisibleDelete"
        width="300px">
      <el-button type="danger" @click="handleDeleteNode">删 除</el-button>
    </el-dialog>
  </div>
</div>
</template>

<script>
import XLSX from 'xlsx'
import { Loading } from 'element-ui'
export default {
  name: 'DataNode',
  computed: {
    auth () {
      return this.$store.state.auth
    },
    rootStatic () {
      return this.$store.state.rootStatic
    }
  },
  data () {
    return {
      nodeType: {
        dir: 0,
        xls: 1,
        img: 2
      },
      notFound: false,
      searchStart: null,
      searchEnd: null,
      dialogVisiblePost: false,
      dialogVisiblePut: false,
      dialogVisibleDelete: false,
      node: {
        id: ''
      },
      newNode: {
        name: '',
        order: '',
        parentId: '',
        type: 0
      },
      loading: {},
      originTableData: [],
      tableData: [],
      tableColumns: [],
      currentFileType: null,
      currentImageUrl: null,
      currentImage: null,
      currentXls: null
    }
  },
  created () {
    // 监听计算结果
    this.$electron.ipcRenderer.on('getNodeListRes', (e, info) => {
      // this.$electron.ipcRenderer.send('state')
      setTimeout(() => {
        // categories 需要是数组
        this.$store.commit('setCategories', [info])
        this.dialogVisiblePost = false
        this.dialogVisiblePut = false
        this.dialogVisibleDelete = false
      }, 2000)
    })
    // 配置文件获取回调
    this.$electron.ipcRenderer.on('getFileRes', (e, bytes) => {
      setTimeout(() => {
        if (bytes === 0) {
          this.notFound = true
          this.$message.error('文件不存在')
          this.$nextTick(() => {
            this.loading.close()
          })
          return
        } else {
          this.notFound = false
        }
        let binary = ''
        let length = bytes.byteLength
        for (let i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        let wb = XLSX.read(binary, {type: 'binary'})
        let wsName = wb.SheetNames[0]
        let ws = wb.Sheets[wsName]
        this.originTableData = XLSX.utils.sheet_to_json(ws)
        this.tableData = XLSX.utils.sheet_to_json(ws)
        let that = this
        Object.keys(this.tableData[0]).forEach(column => {
          that.tableColumns.push(column)
        })
        // 以服务的方式调用的 Loading 需要异步关闭
        this.$nextTick(() => {
          this.loading.close()
        })
      }, 1000)
    })
    // 获取节点信息回调
    this.$electron.ipcRenderer.on('getNodeRes', (e, res) => {
      this.node = res
      // 节点以不存在于数据库中
      if (res === null) {
        // 重新获取目录
        this.$electron.ipcRenderer.send('getNodeList')
        this.$router.push({name: 'DataIndex'})
        this.$nextTick(() => {
          this.loading.close()
        })
        return
      }
      if (this.node['type'] === this.nodeType.xls) {
        // 节点类型是XML
        this.currentFileType = this.nodeType.xls
        this.$electron.ipcRenderer.send('getFileByName', this.node['name'])
      } else if (this.node['type'] === this.nodeType.img) {
        this.currentFileType = this.nodeType.img
        this.currentImageUrl = this.rootStatic + this.node['name']
        // 节点类型是图片
        this.$nextTick(() => {
          this.loading.close()
        })
      } else {
        this.handleInit()
        // 节点类型是文件夹
        this.$nextTick(() => {
          this.loading.close()
        })
      }
    })
    this.$electron.ipcRenderer.on('getDeleteNodeRes', (e, res) => {
      // 重新获取目录
      this.$message.success('删除成功')
      this.$electron.ipcRenderer.send('getNodeList')
      // this.$router.push({name: 'DataIndex'})
    })
    this.$electron.ipcRenderer.on('getPostNodeRes', (e, res) => {
      this.$message.success('新增成功')
      // 重新获取目录
      this.$electron.ipcRenderer.send('getNodeList')
    })
    this.$electron.ipcRenderer.on('getPutNodeRes', (e, res) => {
      this.$message.success('修改成功')
      // 重新获取目录
      this.$electron.ipcRenderer.send('getNodeList')
    })
    // 获取文件上传回调
    this.$electron.ipcRenderer.on('getPostFileRes', (e, fileName) => {
      this.newNode.name = fileName
      this.newNode.parentId = this.node['id']
      this.newNode.order = this.node['order'] ? this.node['order'] + 1 : null
      if (this.currentFileType === this.nodeType.xls) {
        this.newNode.type = 1
      } else if (this.currentFileType === this.nodeType.img) {
        this.newNode.type = 2
      }
      this.$message.success('上传成功')
      console.log(this.newNode)
      this.$electron.ipcRenderer.send('postNode', this.newNode)
    })
    // 文件夹回掉
    this.$electron.ipcRenderer.on('getSaveFileRes', (e, path) => {
      /* json数组转换excel */
      let worksheet = XLSX.utils.json_to_sheet(this.tableData)
      let wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, worksheet, 'sheet1')
      /* 生成文件，导出D盘 */
      XLSX.writeFile(wb, path + '/' + this.node['name'])
      this.$message.success('保存成功')
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.auth['watch'] === 0) {
        return
      }
      vm.loading = Loading.service({
        fullscreen: true,
        text: '数据加载中，请稍等'
      })
      vm.node.id = to.params['id']
      vm.$electron.ipcRenderer.send('getNodeById', to.params['id'])
      vm.handleInit()
    })
  },
  beforeRouteUpdate (to, from, next) {
    if (this.auth['watch'] === 0) {
      return
    }
    this.loading = Loading.service({
      fullscreen: true,
      text: '数据加载中，请稍等'
    })
    this.node.id = to.params['id']
    this.$electron.ipcRenderer.send('getNodeById', to.params['id'])
    this.handleInit()
    next()
  },
  methods: {
    handleInit () {
      this.tableColumns = []
      this.tableData = []
      this.originTableData = []
      // this.currentPage = 1
      this.currentFileType = 0
      this.currentImage = null
      this.currentImageUrl = ''
      // this.currentPageSize = 100
      // this.totalRows = 0
      this.searchStart = null
      this.searchEnd = null
      this.newNode = {
        name: '',
        order: '',
        parentId: '',
        type: 0
      }
    },
    handlePostNode () {
      if (this.newNode['name'] === '') {
        this.$message.error('请输入名称')
        return
      }
      this.newNode.type = this.nodeType.dir
      this.newNode.parentId = this.node['id']
      this.newNode.order = this.node['order'] ? this.node['order'] + 1 : null
      this.$electron.ipcRenderer.send('postNode', this.newNode)
    },
    handlePutNode () {
      if (this.node['name'] === '') {
        this.$message.error('请输入名称')
        return
      }
      this.$electron.ipcRenderer.send('putNode', this.node)
    },
    handleDeleteNode () {
      this.$electron.ipcRenderer.send('deleteNode', this.node['id'])
    },
    handleFileSelect (file) {
      const types = file.name.split('.')[1]
      const imgType = ['jpg', 'jepg', 'png'].some(item => item === types)
      const xlsType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
      if (!imgType && !xlsType) {
        this.$message.error('格式错误！请重新选择')
        return
      }
      if (imgType) {
        this.currentFileType = this.nodeType.img
        // this.currentImageUrl = URL.createObjectURL(file.raw)
        this.currentImageUrl = file.raw
        this.currentImage = file
      } else if (xlsType) {
        this.currentFileType = this.nodeType.xls
        this.currentXls = file
      }
    },
    handleImport () {
      let file = null
      if (this.currentFileType === this.nodeType.xls) {
        file = this.currentXls
      } else if (this.currentFileType === this.nodeType.img) {
        file = this.currentImage
      }
      this.$electron.ipcRenderer.send('postFile', file['raw']['path'], file['name'])
    },
    handleExport () {
      console.log(this.currentFileType)
      if (this.currentFileType === this.nodeType.xls) {
        console.log('xls export')
        this.$electron.ipcRenderer.send('saveFile')
      } else if (this.currentFileType === this.nodeType.img) {
        const link = document.createElement('a')
        link.href = this.currentImageUrl
        link.download = this.node['name']
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
    },
    handleFilter () {
      if (this.searchStart === null || this.searchEnd === null) {
        this.$message.warning('查询条件不能为空！')
        return false
      }
      if (new Date(this.searchStart) > new Date(this.searchEnd)) {
        this.$message.warning('开始时间不能晚于结束时间')
        return false
      }
      let key = null
      this.tableColumns.forEach(item => {
        if (item === '发现日期' || item === '数据采集时间') {
          key = item
        }
      })
      if (key === null) {
        this.$message.warning('表中不存在\'发现日期\'或\'数据采集时间\'')
        return false
      }
      const dataTable = this.originTableData.filter(dataTable => {
        return new Date(dataTable[key]) >= new Date(this.searchStart) && new Date(dataTable[key]) <= new Date(this.searchEnd)
        // 大于等于开始日期或者小于等于结束日期
      })
      this.tableData = dataTable
      // this.totalRows = this.tableData.length
    },
    handleFilterClear () {
      this.searchStart = null
      this.searchEnd = null
      this.tableData = this.originTableData
    }
  }
}
</script>

<style lang="scss">
  .DataNode{
    height: 100%;
    .Tips{
      text-align: center;
      padding: 50px;
      font-size: 20px;
    }
    .el-container{
      height: 100%!important;
      .el-header{
        padding: 20px!important;
        height: 80px!important;
        border-bottom: solid 1px #ddd;
        line-height: 40px;
      }
      .el-main{
        height: 100%;
        .divSearch{
          padding: 0px 20px!important;
          height: 80px!important;
          line-height: 80px;
          text-align: left;
        }
        .plTableBox{
          height: calc(100% - 80px);
        }
      }
      .el-footer{
        padding: 0 20px!important;
        height: 100px!important;
        line-height: 100px!important;
        border-top: solid 1px #ddd;
      }
    }
    .el-drawer{
      .el-button{
        display: block!important;
        margin: 20px!important;
      }
    }
  }
</style>
