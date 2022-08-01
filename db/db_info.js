var db_host = "210.114.18.107";
var db_port = "3306";
var db_user = "user_dev";
var db_pw = "user_dev";
var db_name = "smart_opener";
// var db_name = "smart_stage9";
// var db_name = "smart_buildone";

// var db_host = "183.111.125.45";
// var db_port = "3306";
// var db_user = "root";
// var db_pw = "oa-homs21";
// var db_name = "smart_royal";

module.exports = (function () {
  
    return {
      local: { // localhost
        host: db_host,
        port: db_port,
        user: db_user,
        password: db_pw,
        database: db_name
      },
      real: { // real server db info
        host: db_host,
        port: db_port,
        user: db_user,
        password: db_pw,
        database: db_name
      },
      dev: { // dev server db info
        host: db_host,
        port: db_port,
        user: db_user,
        password: db_pw,
        database: db_name
      }
    }
  })();