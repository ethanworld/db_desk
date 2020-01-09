const { ipcMain, dialog } = require('electron')
let fs = require('fs')
let mkdirp = require('mkdirp')
let getDirName = require('path').dirname
let models = require('./db')// 数据库链接信息
let mysql = require('mysql')
let $sql = require('./sql')
// let fileRoot = __dirname.substring(0, __dirname.length - 6) + 'dist\\static\\files\\'
let fileRoot = 'C:\\Users\\ZengYuan\\Desktop\\dist\\static\\files\\'

// 连接数据库
let conn = mysql.createConnection(models.mysql)
conn.connect()
function writeFile (path, contents, callback) {
  mkdirp(getDirName(path), function (err) {
    if (err) return callback(err)
    fs.writeFile(path, contents, callback)
  })
}
function buildJson (node, list) {
  let arr = []
  for (let i = 0; i < list.length; i++) {
    if (list[i]['parentId'] === node['id']) {
      buildJson(list[i], list)
      arr.push(list[i])
    }
  }
  node['children'] = arr
}

exports.api = function () {
  ipcMain.on('login', (event, arg) => {
    let sql = $sql.user.login
    conn.query(sql, [arg.username, arg.password], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        event.sender.send('getLoginRes', result[0])
      }
    })
  })
  ipcMain.on('userList', (event, arg) => {
    let sql = $sql.user.getList
    conn.query(sql, null, function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        event.sender.send('getUserListRes', result)
      }
    })
  })
  ipcMain.on('modifyUser', (event, params) => {
    let sql = $sql.user.put
    let paramList = [
      params.username,
      params.password,
      params.isAdmin,
      params.upload,
      params.download,
      params.delete,
      params.watch,
      params.id
    ]
    conn.query(sql, paramList, function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        event.sender.send('getModifyUserRes', result)
      }
    })
  })
  ipcMain.on('addUser', (event, params) => {
    let sql = $sql.user.post
    let paramList = [
      params.username,
      params.password,
      params.isAdmin,
      params.upload,
      params.download,
      params.delete,
      params.watch
    ]
    conn.query(sql, paramList, function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        event.sender.send('getAddUserRes', result)
      }
    })
  })
  ipcMain.on('deleteUser', (event, id) => {
    let sql = $sql.user.delete
    conn.query(sql, [id], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        event.sender.send('getDeleteUserRes', result)
      }
    })
  })
  ipcMain.on('getNodeList', (event, arg) => {
    let sql = $sql.categories.getList
    conn.query(sql, null, function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        buildJson(result[0], result)
      }
      event.sender.send('getNodeListRes', result[0])
    })
  })
  ipcMain.on('getNodeById', (event, arg) => {
    let sql = $sql.categories.get
    conn.query(sql, [arg], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        event.sender.send('getNodeRes', result[0])
      }
    })
  })
  ipcMain.on('putNode', (event, params) => {
    let sql = $sql.categories.update
    let paramList = [
      params.name,
      params.order,
      params.type,
      params.layer,
      params.parentId,
      params.id
    ]
    conn.query(sql, paramList, function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        event.sender.send('getPutNodeRes', result[0])
      }
    })
  })
  ipcMain.on('postNode', (event, params) => {
    let sql = $sql.categories.post
    let paramList = [
      params.name,
      params.order,
      params.layer,
      params.type,
      params.parentId
    ]
    console.log(params)
    conn.query(sql, paramList, function (err, result) {
      // console.log(result)
      if (err) {
        console.log(err)
      }
      if (result) {
        event.sender.send('getPostNodeRes', result)
      }
    })
  })
  ipcMain.on('deleteNodeById', (event, id) => {
    let sql = $sql.categories.delete
    conn.query(sql, [id], function (err, result) {
      if (err) {
        console.log(err)
      }
      if (result) {
        event.sender.send('getDeleteNodeRes', result[0])
      }
    })
  })
  ipcMain.on('getFileByName', (event, name) => {
    fs.readFile('C:\\Users\\ZengYuan\\Desktop\\files\\' + name, (err, data) => {
      if (err) throw err
      event.sender.send('getFileRes', data)
    })
  })
  ipcMain.on('postFile', (event, filePath, fileName) => {
    fs.readFile(filePath, function (err, data) {
      let desFile = fileRoot + fileName
      if (err) {
        console.log(err)
        return false
      }
      writeFile(desFile, data, function (err) {
        if (err) {
          console.log(err)
        } else {
          event.sender.send('getPostFileRes', fileName)
        }
      })
    })
  })
  ipcMain.on('saveFile', (event) => {
    dialog.showOpenDialog({properties: ['openDirectory']}, function (filename) {
      // 通知渲染进程，将获取到的文件路径传给Vue组件中响应函数
      event.sender.send('getSaveFileRes', filename)
    })
  })
}
