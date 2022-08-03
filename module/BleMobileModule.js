const express = require('express')
var router = express.Router();
const fs = require('fs')
const url = require('url');

const mysql = require("./MySQL.js")


const multer = require('multer');
const path = require('path');
const { Console } = require('console');

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
      title: req.app.locals.hotelName,
      openKey: openKey,
      layout: false,
      hotelCode: req.app.locals.hotelCode
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

  res.render("ble/mobile/index",{
    page:"login",
    title: req.app.locals.hotelName
  })
});
  
//mysql
const connection = mysql.connection()

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
          console.log(rows[0].BS_CODE);
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
module.exports = router;