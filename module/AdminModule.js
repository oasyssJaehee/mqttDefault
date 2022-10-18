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

router.get('/index', function (req, res) {
    if(req.session.admin){
        res.render("admin/index",{
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

module.exports = router;
