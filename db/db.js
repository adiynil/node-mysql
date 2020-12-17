const mysql = require('mysql')
const config = require('./db_config')

const pool = mysql.createPool(config)

const query = function(...args) {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    if (args.length > 2) {
      connection.query(args[0], args[1], (err, res) => {
        args[2] && args[2](err, res)
        connection.release()
      })
    } else {
      connection.query(args[0], (err, res) => {
        args[1] && args[1](err, res)
        connection.release()
      })
    }
  })
}

module.exports = {
  query
}
