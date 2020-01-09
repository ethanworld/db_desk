// sql语句
let sqlMap = {
  // 用户
  user: {
    login: 'select * from `user` where username = ? and password = ?;',
    put: 'update `user` set `username` = ?, `password` = ?, `isAdmin` = ?, `upload` = ?, `download` = ?,' +
      '`delete` = ?, `watch` = ? where id = ?',
    getList: 'select * from `user`;',
    delete: 'delete from `user` where id = ?',
    post: 'insert into `user` (`username`, `password`, `isAdmin`, `upload`, `download`, `delete`, `watch`) values (?, ?, ?, ?, ?, ?, ?)'
  },
  categories: {
    getList: 'SELECT *  FROM  category',
    get: 'SELECT *  FROM  category where id = ?',
    delete: 'delete from `category` where id = ?',
    update: 'update `category` set `name` = ?, `order` = ?, `type` = ?, `layer` = ?, `parentId` = ? where id = ?',
    post: 'insert into `category`(name, `order`, layer, type, parentId) values (?, ?, ?, ?, ?)'
  }
}

module.exports = sqlMap
