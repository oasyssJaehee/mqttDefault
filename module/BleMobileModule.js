const express = require('express')
var router = express.Router();
const fs = require('fs')
const url = require('url');

const mysql = require("./MySQL.js")


const multer = require('multer');
const path = require('path');
const { Console } = require('console');
const crypto = require('./crypto');
const AppInfo = require('./AppInfo');

// multer setting
const upload = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    // convert a file name
    filename: (req, file, cb) => {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
});
router.use((req, res, next) => {
  // changing layout for my admin panel
  req.app.set('layout', 'ble/mobile/layout');
  next();
});
router.post('/', upload.single('img'));


router.get('/index', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  console.log(dec);

  var pri_check = req.cookies["pri_check"];
  var guide_check = req.cookies["guide_check"];
  res.render("ble/mobile/index",{
    page:"index",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key,
    pri_check: pri_check,
    guide_check:guide_check
  })
});
router.get('/keySett', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/keySett",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })
});
router.get('/index1', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/index1",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })
});
router.get('/index2', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/index2",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })
});
router.get('/index3', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/index3",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })

  sendSms(query);

});
router.get('/index4', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/index4",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })
});
//mysql
const connection = mysql.connection()

router.get('/pri_cookie', function (req, res) {
  res.cookie("pri_check", "1", {
    maxAge: (1000*60*60*24) * 7
  });
  res.setHeader('Content-Type', 'application/json');
  res.send();
  res.end();
});
router.get('/guide_cookie', function (req, res) {
  res.cookie("guide_check", "1", {
    maxAge: (1000*60*60*24) * 7
  });
  res.setHeader('Content-Type', 'application/json');
  res.send();
  res.end();
});
router.get('/mysql/co', function (req, res) {
  var uri = req.url;
var data = url.parse(uri, true).query;
var format = {language: 'sql', indent: '  '};
var xml_name = data.xml;
var query = mysql.coMapper().getStatement("co", xml_name, data, format);

  connection.query(query, function (err, rows, fields) {
    if(err){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(err));
        res.end();
    }else{
        res.setHeader('Content-Type', 'application/json');
        if(rows.length > 0){
          data.code = rows[0].BS_CODE;
          query = mysql.coMapper().getStatement("co", "bs_code_insert", data, format);
          connection.query(query, function (err, rows, fields) {
            if(err){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(err));
                res.end();
            }else{
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                  console.log(rows);
        
                  
                }
                var result = JSON.stringify(rows)
                
                res.send(result);
                res.end();
            }
          });
        }
    }
  });
});
router.get('/doorSett', function (req, res) {
  var uri = req.url;
var data = url.parse(uri, true).query;
var format = {language: 'sql', indent: '  '};

var pass = data.pass;
var cleaner = data.cleaner;
var master = data.master;
var doorTime = data.doorTime;
var passTime = data.passTime;
var user = data.user;
var admin = data.admin;

if(pass == undefined) pass = "";
if(cleaner == undefined) cleaner = "";
if(master == undefined) master = "";
if(doorTime == undefined){
  doorTime = "";
}else{
  let today = new Date();   
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1;  // 월
  let date = today.getDate();  // 날짜
  let hours = today.getHours(); // 시
  let minutes = today.getMinutes();  // 분
  
  year = String(year).substr(0,4);
  if(month < 10){
    month = "0"+month;
  }
  if(date < 10){
    date = "0"+date;
  }
  if(hours < 10){
    hours = "0"+hours;
  }
  if(minutes < 10){
    minutes = "0"+minutes;
  }
  doorTime = year+""+month+""+date+""+hours+""+minutes;
}
if(passTime == undefined){
  passTime = "";
}else{
  var date = passTime;
  date = date.replace(/-/gi, "");
  date = date.replace(/ /gi, "");
  date = date.replace(/PM/gi, "");
  date = date.replace(/AM/gi, "");
  date = date.replace(/:/gi, "");

  var year = date.substring(0,4);
  var month = date.substring(4,6);
  var toDate = date.substring(6,8);
  var hours = date.substring(8,10);
  var minutes = date.substring(10,12);
  passTime = year+""+month+""+toDate+""+hours+""+minutes;
} 
if(user == undefined) user = "";
if(admin == undefined) admin = "";

var input = {};
input = {
  pass: pass,
  cleaner: cleaner,
  master: master,
  doorTime: doorTime,
  passTime: passTime,
  user: user,
  admin: admin,
  rono: data.rono,
  bsCode: data.bsCode
}

var query = mysql.mqttMapper().getStatement("mqtt", "door_time_check", input, format);

  connection.query(query, function (err, rows, fields) {
    if(err){
      console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(err));
        res.end();
    }else{
        res.setHeader('Content-Type', 'application/json');
        if(rows.length > 0){
          query = mysql.mqttMapper().getStatement("mqtt", "door_sett_update", input, format);
          connection.query(query, function (err, rows, fields) {
            if(err){
              console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(err));
                res.end();
            }else{
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                  console.log(rows);
                }
                var result = JSON.stringify(rows)
                res.send(result);
                res.end();
            }
          });
        }else{
          
          query = mysql.mqttMapper().getStatement("mqtt", "door_sett_insert", input, format);
          connection.query(query, function (err, rows, fields) {
            if(err){
              console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(err));
                res.end();
            }else{
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                  console.log(rows);
                }
                var result = JSON.stringify(rows)
                res.send(result);
                res.end();
            }
          });
        }
    }
  });
});
router.get('/room_set_stau', function (req, res) {
  var uri = req.url;
  var inputData = url.parse(uri, true).query;
  if(inputData.stau_oo != "Repair" && inputData.stau_oo != "Check In"){
    if(inputData.clean == "0"){
      inputData.status = "0030004";
    }
    if(inputData.clean == "1"){
      inputData.status = "0030005";
    }
  }
  var format = {language: 'sql', indent: '  '};
  var query ;
  var jsonObj = new Object();
  res.setHeader('Content-Type', 'application/json');
  query = mysql.apiMapper().getStatement("api", "room_clean_update", inputData, format);
  connection.query(query, function (err, rows, fields) {
      if(err){
          console.log(err);
      }else{
        
          query = mysql.apiMapper().getStatement("api", "cleaner_log_insert", inputData, format);
          connection.query(query, function (err, rows, fields) {
              if(err){
                  console.log(err);
              }else{
                  var jsonObj = new Object();
                  var resData = {};
                  resData.res = "101"
                  jsonObj.data = resData;
                  var result = JSON.stringify(jsonObj)
                  res.send(result);
                  res.end();
                  for(var i=0; i<AppInfo.adminSocketArray.length; i++){
                    var bsCode = AppInfo.adminSocketArray[i].bsCode;
                    const io = req.app.get("io");
                    var socketTypeMsg = "";
                    if(inputData.clean == "1"){
                        socketTypeMsg = "guestClean1"
                    }else{
                        socketTypeMsg = "guestClean0"
                    }
                    io.to("admin_"+bsCode).emit("refresh",{
                        type:socketTypeMsg,
                        rono:inputData.rono
                    });
                }
                  //pms에도 보내줌
                  var api_url = AppInfo.pmsUrl+"/api/app/room_set_stau.do";
                  var request = require('request');
                  var options = {
                      url: api_url,
                      method:'POST',
                      form:inputData
                  };
                  request.post(options, function (error, response, body) {
                      console.log(body);
                      if (!error && response.statusCode == 200) {
                      } else {
                          console.log('error = ' + response.statusCode);
                      }
                  });
              }
          });
      }
  });
});
router.get('/mysql/fo', function (req, res) {
  var uri = req.url;
var data = url.parse(uri, true).query;
var format = {language: 'sql', indent: '  '};
var xml_name = data.xml;
var query = mysql.foMapper().getStatement("fo", xml_name, data, format);

  connection.query(query, function (err, rows, fields) {
    if(err){
      console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(err));
        res.end();
    }else{
        res.setHeader('Content-Type', 'application/json');
        var result = JSON.stringify(rows)
        res.send(result);
        res.end();
        
    }
  });
});
module.exports = router;