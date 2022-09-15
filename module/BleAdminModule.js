const express = require('express')
var router = express.Router();
const fs = require('fs')
const url = require('url');
const mysql = require("./MySQL.js");
const connection = mysql.connection();
const AppInfo = require('./AppInfo');

router.use((req, res, next) => {
    // changing layout for my admin panel
    req.app.set('layout', 'ble/web/admin/layout');
    next();
});
router.get('/login', function (req, res) {
  // var filter = "win16|win32|win64|macintel|mac|"; // PC일 경우 가능한 값
  // if (req.header('user-agent').indexOf('Mobile') != -1) {
  //     res.redirect("/opener/mobile/login")
  //     return;
  // } 
  res.render("ble/web/admin/login",{
      title:'로그인',
      layout: false
  })
});
router.get('/main', function (req, res) {
    if(req.session.admin){
        res.render("ble/web/admin/main",{
            session: req.session.admin,
            title:req.session.admin.bsTitle,
            bsCode: req.session.admin.bsCode,
            logoName: req.session.admin.bsLogo,
            AES_KEY: AppInfo.AES_KEY
        })
    }else{
        res.redirect("/ble/admin/login");
    }
 
});
router.get('/roomSett', function (req, res) {
  
  if(req.session.admin){
    res.render("ble/web/admin/roomSett",{
        session: req.session.admin,
        title:req.session.admin.bsTitle,
        bsCode: req.session.admin.bsCode,
        logoName: req.session.admin.bsLogo
    })
  }else{
      res.redirect("/ble/admin/login");
  }
});
router.get('/mqttSett', function (req, res) {
  
  if(req.session.admin){
    res.render("ble/web/admin/mqttSett",{
        session: req.session.admin,
        title:req.session.admin.bsTitle,
        bsCode: req.session.admin.bsCode,
        logoName: req.session.admin.bsLogo
    })
  }else{
      res.redirect("/ble/admin/login");
  }
});
router.get('/keyLog', function (req, res) {
  
  if(req.session.admin){
    res.render("ble/web/admin/keyLog",{
        session: req.session.admin,
        title:req.session.admin.bsTitle,
        bsCode: req.session.admin.bsCode,
        logoName: req.session.admin.bsLogo
    })
  }else{
      res.redirect("/ble/admin/login");
  }
});
router.get('/smsList', function (req, res) {
  
  if(req.session.admin){
    res.render("ble/web/admin/smsList",{
        session: req.session.admin,
        title:req.session.admin.bsTitle,
        bsCode: req.session.admin.bsCode,
        logoName: req.session.admin.bsLogo
    })
  }else{
      res.redirect("/ble/admin/login");
  }
});
router.get('/actionLog', function (req, res) {
  
  if(req.session.admin){
    res.render("ble/web/admin/actionLog",{
        session: req.session.admin,
        title:req.session.admin.bsTitle,
        bsCode: req.session.admin.bsCode,
        logoName: req.session.admin.bsLogo
    })
  }else{
      res.redirect("/ble/admin/login");
  }
});
router.get('/cleanLog', function (req, res) {
  
  if(req.session.admin){
    res.render("ble/web/admin/cleanLog",{
        session: req.session.admin,
        title:req.session.admin.bsTitle,
        bsCode: req.session.admin.bsCode,
        logoName: req.session.admin.bsLogo
    })
  }else{
      res.redirect("/ble/admin/login");
  }
});
router.get('/index3', function (req, res) {
  
  res.render("ble/web/admin/index3",{
    page:"index",
    title: req.app.locals.hotelName,
    logoName:"a"
  })
});

//로그인세션
router.get('/mysql/admin_login', function (req, res) {
  var uri = req.url;
  var data = url.parse(uri, true).query;
  var format = {language: 'sql', indent: '  '};
  var xml_name = data.xml;
  var query = mysql.userMapper().getStatement("user", xml_name, data, format);
    
    connection.query(query, function (err, rows, fields) {
      if(err){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(err));
          res.end();
      }else{
          res.setHeader('Content-Type', 'application/json');
          if(rows.length > 0){
            req.session.admin = {
                key: rows[0].ADMIN_KEY,
                id: rows[0].ADMIN_ID,
                name: rows[0].ADMIN_NAME,
                edate: rows[0].ADMIN_EDATE,
                level : rows[0].ADMIN_LEVEL,
                bsCode: rows[0].ADMIN_BS_CODE,
                imgName: rows[0].IMGNAME,
                imgPath: rows[0].IMGPATH,
                ck: data.ck,
                createCurTime: new Date(),
                bsLogo: rows[0].BS_LOGO,
                bsTitle: rows[0].BS_NAME,
                bsTel: rows[0].BS_TEL,
                authorized: true
            };
          }
          var result = JSON.stringify(rows)
          
          res.send(result);
          res.end();
      }
    });
  });
  //객실 동기화
  router.get('/room_remove', function (req, res) {
    var uri = req.url;
    var data = url.parse(uri, true).query;
    var format = {language: 'sql', indent: '  '};
    var result="";
    var resData = {};
    var query = mysql.userMapper().getStatement("room", "room_sync_log_insert", data, format);
      
      connection.query(query, function (err, rows, fields) {
        if(err){
          console.log(err);
            res.setHeader('Content-Type', 'application/json');
            result = JSON.stringify(resData)
            res.send(result);
            res.end();
        }else{
            res.setHeader('Content-Type', 'application/json');
            query = mysql.userMapper().getStatement("room", "room_sync_delete", data, format);
            connection.query(query, function (err, rows, fields) {
              if(err){
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify(err));
                  res.end();
              }else{
                  resData.res = "101";
                  result = JSON.stringify(resData)
                  res.send(result);
                  res.end();
              }
            });
            
        }
      });
    });
router.get('/room_sync_check', function (req, res) {
  var uri = req.url;
  var data = url.parse(uri, true).query;
  var format = {language: 'sql', indent: '  '};
  var query = mysql.userMapper().getStatement("room", "room_sync_select", data, format);
    connection.query(query, function (err, rows, fields) {
      if(err){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(err));
          res.end();
      }else{
          res.setHeader('Content-Type', 'application/json');
          var originList = rows;

          var headersOpt = {  
              "content-type": "application/json",
              "Accept":"text/html"
          };
          var api_url = AppInfo.pmsUrl+"/api/app/room_sync_check.do";
            var request = require('request');
            var options = {
                url: api_url,
                method:'POST',
                headers: headersOpt,
                json:true
                
            };
            request.post(options, function (error, response, body) {
                
                if (!error && response.statusCode == 200) {
                  var updateArray = new Array();
                  var insertArray = new Array();

                  var newList = body.data;
                  
                  for(var i=0; i<newList.length; i++){
                    var rono;
                    for(var j=0; j<originList.length; j++){
                      if(newList[i].rono == originList[j].RONO){
                        rono = newList[i].rono;
                        
                        if(newList[i].floor != originList[j].FLOOR){
                          newList[i].diffe = "floor";
                        }else if(newList[i].rtype != originList[j].RTYPE){
                          newList[i].diffe = "rtype";
                        }else if(newList[i].clean != originList[j].CLEAN){
                          newList[i].diffe = "clean";
                        }else{
                          newList[i].diffe = "";
                        }
                        updateArray.push(newList[i]);
                      }
                    }
                    if(rono != newList[i].rono){
                      newList[i].diffe = "new";
                      insertArray.push(newList[i]);
                    }
                  }
                  var jsonObject = new Object();
                  jsonObject.insert = insertArray;
                  jsonObject.update = updateArray;
                  jsonObject.origin = rows;
                  var result = JSON.stringify(jsonObject)
                    res.send(result);
                    res.end();
                } else {
                    console.log('error = ' + response.statusCode);
                }
            });
      }
    });
  });
  router.get('/room_sync_check_excel', function (req, res) {
    var uri = req.url;
    var data = url.parse(uri, true).query;
    var format = {language: 'sql', indent: '  '};
    var query = mysql.userMapper().getStatement("room", "room_sync_select", data, format);
      connection.query(query, function (err, rows, fields) {
        if(err){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(err));
            res.end();
        }else{
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(rows));
          res.end();
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
  //로그아웃
  router.get('/user_log_out', function (req, res) {
    var session = req.session
    try {
        if (session.admin) { //세션정보가 존재하는 경우
            req.session.destroy(function (err) {
                if (err)
                    console.log(err)
                else {
                  res.redirect("/opener/admin/login")
                }
            });
        }
    }
    catch (e) {
      console.log(e);
    }
  });

module.exports = router;