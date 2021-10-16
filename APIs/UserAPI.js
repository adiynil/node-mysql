const db = require('../db/db')

// sql string
const [DEFAULT_PASSWORD, DEFAULT_GENDER] = ['12345', 1]
const SQL_INSERT_SINGLE = `insert into user(names,password,gender) values(?,?,?)`
const SQL_INSERT_MULTI = `insert into user(name,password,gender) values ?`
const SQL_DELETE_FORCE = `delete from user where uid in (?)`
const SQL_DELETE_SOFT = `update user set status=0 where uid in (?)`
const SQL_SELECT_BYID = `select * from user where uid=?`
const SQL_SELECT_ALL = `select * from user`
const SQL_UPDATE_BYID = `update user set name=?,gender=? where uid=?`
const SQL_UPDATE_PASSWORD = `update user set password=? where uid=?`

const MESSAGE = {
  OK: function(rows) {
    return {
      status: 1,
      message: "OK",
      affectedRows: rows
    }
  },
  SQL_ERROR: function(msg) {
    return {
      status: 0,
      message: msg
    }
  },
  PASSWORD_INCORRECT: function() {
    return {
      status: 0,
      message: "PASSWORD INCORRECT"
    }
  },
  DATA: function(data) {
    return {
      status: 1,
      message: "OK",
      data: data
    }
  }
}

/**
 * function accept a Object
 * attribute
 *  required: 'name'
 *  optional: 'password' 'gender'
 */
const insertOne = async function(_user) {
  return new Promise((resolve, reject) => {
    let name = _user.name
    let password = _user.password || DEFAULT_PASSWORD
    let gender = _user.gender || DEFAULT_GENDER
    let val = [name, password, gender]
    db.query(SQL_INSERT_SINGLE, val, (err, res) => {
      // console.log(err)
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage))
      resolve(MESSAGE.OK(res.affectedRows))
    })
  })
}

/**
 * function accept a Array of Objects
 * Object attribute
 *  required: 'name'
 *  optional: 'password' 'gender'
 */
const insertSome = async function(_users) {
  return new Promise((resolve, reject) => {
    let vals = []
    _users.forEach(user => {
      let name = user.name
      let password = user.password || DEFAULT_PASSWORD
      let gender = user.gender || DEFAULT_GENDER
      let val = [name, password, gender]
      vals.push(val)
    })
    db.query(SQL_INSERT_MULTI, [vals], (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage))
      resolve(MESSAGE.OK(res.affectedRows))
    })
  })
}

/**
 * function accept a Number or a Array of Numbers
 */
const deleteById = async function(...id) {
  return new Promise((resolve, reject) => {
    let vals = [...id]
    db.query(SQL_DELETE_SOFT, vals, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage))
      resolve(MESSAGE.OK(res.affectedRows))
    })
  })
}

/**
 * function accept a Number or a Array of Numbers
 */
const forceDelete = async function(...id) {
  return new Promise((resolve, reject) => {
    let vals = [...id]
    db.query(SQL_DELETE_FORCE, vals, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage))
      resolve(MESSAGE.OK(res.affectedRows))
    })
  })
}

/**
 * function accept a Object
 * attribute
 *  required: 'uid' 'name' 'gender'
 */
const updateById = async function(_user) {
  return new Promise((resolve, reject) => {
    let name = _user.name
    let gender = _user.gender
    let id = _user.id
    let val = [name, gender, id]
    db.query(SQL_UPDATE_BYID, val, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage))
      resolve(MESSAGE.OK(res.affectedRows))
    })
  })
}

/**
 * function accept a Number
 * return a User Object
 */
const findById = async function(_id) {
  return new Promise((resolve, reject) => {
    let val = [_id]
    db.query(SQL_SELECT_BYID, val, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage))
      resolve(MESSAGE.DATA(res))
    })
  })
}

/**
 * function
 * return a Array of User Objects
 */
const findAll = async function() {
  return new Promise((resolve, reject) => {
    db.query(SQL_SELECT_ALL, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage))
      resolve(MESSAGE.DATA(res))
    })
  })
}

/**
 * function accept a User Object and a new Password
 */
const changePassword = async function(_user, _nPassword) {
  return new Promise(async (resolve, reject) => {
    let target = await findById(_user.id)
    let oPassword = target.data[0].password
    if (oPassword != _user.password)
      resolve(MESSAGE.PASSWORD_INCORRECT)
    let val = [_nPassword, _user.id]
    db.query(SQL_UPDATE_PASSWORD, val, (err, res) => {
      if (err) resolve(MESSAGE.SQL_ERROR(err.sqlMessage))
      resolve(MESSAGE.OK(res.affectedRows))
    })
  })
}

module.exports = {
  insertOne,
  insertSome,
  deleteById,
  forceDelete,
  findById,
  findAll,
  updateById,
  changePassword
}

let u = {
  name: 'demo101'
}

insertOne(u).then(data => {
  console.log(data)
})

// console.log('sasa')
