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


router.get('/login', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var openKey="";
  openKey = query.openKey;
  if(openKey){
    res.render("ble/mobile/login",{
      page:"login",
      title: AppInfo.hotelName,
      openKey: openKey,
      layout: false,
      hotelCode: AppInfo.hotelCode,
      logoName : AppInfo.logoName
    })
  }else{
    if(req.session.user){
      res.redirect("/ble/mobile/main")
      // res.render("opener/mobile/login",{})
    }else{
      res.render("ble/mobile/login",{
        page:"login",
        title: req.app.locals.hotelName,
        openKey: openKey,
        layout: false,
        hotelCode: req.app.locals.hotelCode
      })
    }
  }
});
router.get('/index', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");

  var pri_check = req.cookies["pri_check"];
  res.render("ble/mobile/index",{
    page:"index",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key,
    pri_check: pri_check
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

  res.render("ble/mobile/index1",{
    page:"login",
    title: req.app.locals.hotelName
  })
});
router.get('/index2', function (req, res) {
  var uri = req.url;

  res.render("ble/mobile/index2",{
    page:"login",
    title: req.app.locals.hotelName
  })
});
router.get('/index3', function (req, res) {
  var uri = req.url;

  res.render("ble/mobile/index3",{
    page:"login",
    title: req.app.locals.hotelName
  })
});
router.get('/index4', function (req, res) {
  var uri = req.url;

  res.render("ble/mobile/index4",{
    page:"login",
    title: req.app.locals.hotelName
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
//업체코드 입력
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