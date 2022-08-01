const express = require('express');
const { append } = require('express/lib/response');
var router = express.Router();
const fs = require('fs')
const url = require('url');
const mysql = require("./MySQL.js");

const app = require("../app.js");

const connection = mysql.connection();


router.post('/user_face_list', function (req, res) {
   var inputData;
   req.on('data', (data) => {
     inputData = JSON.parse(data);
     var format = {language: 'sql', indent: '  '};
    var query = mysql.userMapper().getStatement("user", "face_user_list", inputData, format);
    
    connection.query(query, function (err, rows, fields) {
        if(err){
            res.write(JSON.stringify(err));
            res.end();
        }else{
            res.setHeader('Content-Type', 'application/json');
            if(rows.length > 0){
                console.log(rows);
            }
            var result = JSON.stringify(rows)
            
            res.write(result);
            res.end();
        }
    });
   });
});
router.post('/pass_select', function (req, res) {
   var inputData;
   console.log("pass_select");
   req.on('data', (data) => {
     inputData = JSON.parse(data);
     console.log(inputData);
     var format = {language: 'sql', indent: '  '};
    var query = mysql.userMapper().getStatement("room", "pass_select", inputData, format);
    
    connection.query(query, function (err, rows, fields) {
        if(err){
            res.write(JSON.stringify(err));
            res.end();
        }else{
            res.setHeader('Content-Type', 'application/json');
            if(rows.length > 0){
                console.log(rows);
            }
            var result = JSON.stringify(rows)
            
            res.write(result);
            res.end();
        }
    });
   });
});

router.post('/mqtt_on', function (req, res) {
    console.log('who get in here post /users');
   var inputData;
   req.on('data', (data) => {
     inputData = JSON.parse(data);
    app.appRelayOn(inputData)
     res.setHeader('Content-Type', 'application/json');

     var result = JSON.stringify(inputData)
     
     res.write(result);
     res.end();
   });
});
router.post('/user_login_app', function (req, res) {
    var inputData;
    req.on('data', (data) => {
      inputData = JSON.parse(data);
      var format = {language: 'sql', indent: '  '};
     var query = mysql.userMapper().getStatement("user", "user_login_app", inputData, format);
     
     connection.query(query, function (err, rows, fields) {
         if(err){
             res.write(JSON.stringify(err));
             res.end();
         }else{
             res.setHeader('Content-Type', 'application/json');
             var result = JSON.stringify(rows)
             
             res.write(result);
             res.end();
         }
     });
    });
 });
 router.post('/user_login_app_auto', function (req, res) {
    var inputData;
    req.on('data', (data) => {
      inputData = JSON.parse(data);
      var format = {language: 'sql', indent: '  '};
     var query = mysql.userMapper().getStatement("user", "user_login_app_auto", inputData, format);
     
     connection.query(query, function (err, rows, fields) {
         if(err){
             res.write(JSON.stringify(err));
             res.end();
         }else{
             res.setHeader('Content-Type', 'application/json');
             var result = JSON.stringify(rows)
             
             res.write(result);
             res.end();
         }
     });
    });
 });
module.exports = router;