const express = require('express')
var router = express.Router();
const fs = require('fs')
const url = require('url');
const mysql = require("./MySQL.js");
const connection = mysql.connection();

router.use((req, res, next) => {
    // changing layout for my admin panel
    req.app.set('layout', 'ble/web/admin/layout');
    next();
});


router.get('/index', function (req, res) {
  
  res.render("ble/web/admin/index",{
    page:"index",
    title: req.app.locals.hotelName
  })
});
router.get('/index1', function (req, res) {
  
  res.render("ble/web/admin/index1",{
    page:"index",
    title: req.app.locals.hotelName
  })
});
router.get('/index2', function (req, res) {
  
  res.render("ble/web/admin/index2",{
    page:"index",
    title: req.app.locals.hotelName
  })
});
router.get('/index3', function (req, res) {
  
  res.render("ble/web/admin/index3",{
    page:"index",
    title: req.app.locals.hotelName
  })
});
module.exports = router;