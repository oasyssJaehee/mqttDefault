var mysql = require('mysql');
var config = require('../db/db_info').real;

module.exports = function () {
  return {
    init: function () {
      return mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database
      })
    },

    open: function (con) {
      con.connect(function (err) {
        if (err) {
          console.error('mysql connection error :' + err);
        } else {
          console.info('mysql is connected successfully.');
        }
      });
    },
    close : function(con){
      con.end(function (err){
        if(err){
          console.error('mysql end error :' + err);
        }else{
          console.error('mysql is end successfully');
        }
      });
    }
  }
};