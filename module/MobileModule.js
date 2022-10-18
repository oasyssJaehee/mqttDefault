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
module.exports = router;