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
            logoName: req.session.admin.bsLogo
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