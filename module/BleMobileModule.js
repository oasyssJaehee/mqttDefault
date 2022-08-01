const express = require('express')
var router = express.Router();
const fs = require('fs')
const url = require('url');

const mysql = require("./MySQL.js")


const multer = require('multer');
const path = require('path');

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
  
module.exports = router;