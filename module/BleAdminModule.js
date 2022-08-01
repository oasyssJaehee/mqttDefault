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


router.get('/login', function (req, res) {
  res.render("ble/web/admin/login",{
      session: req.session.admin,
      title:req.app.locals.hotelName,
      hotelCode: req.app.locals.hotelCode
  })
});
module.exports = router;