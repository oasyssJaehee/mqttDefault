const express = require('express');
const { append } = require('express/lib/response');
var router = express.Router();
const fs = require('fs')
const url = require('url');
const mysql = require("./MySQL.js");

const app = require("../app.js");

const crypto = require('./crypto');
const AppInfo = require('./AppInfo');

const connection = mysql.connection();

//네이버 단축url
var client_id = 'Enf1AXBGHTvc10FPuAeM';//개발자센터에서 발급받은 Client ID
var client_secret = 'w86vBqAr4O'; //개발자센터에서 발급받은 Client Secret


//keyless
router.post('/apiKeyCreate', function (req, res) {
   res.setHeader('Content-Type', 'application/json');
   var inputData;
   req.on('data', (data) => {
    
    inputData = JSON.parse(data);
    console.log(inputData);
    var format = {language: 'sql', indent: '  '};
    var query = mysql.userMapper().getStatement("api", "bridge_tran_overlab", inputData, format);
    connection.query(query, function (err, rows, fields) {
        if(err){
            res.send(JSON.stringify(err));
            res.end();
        }else{
            if(rows.length > 0){
                var rowsData = {
                    rspk : rows[0].BRIDGE_TRAN_RSPK,
                    gname : rows[0].BRIDGE_TRAN_GNAME,
                    idate : rows[0].BRIDGE_TRAN_IDATE,
                    odate : rows[0].BRIDGE_TRAN_ODATE,
                    res: "116"
                }
                
                var result = JSON.stringify(rowsData)
                res.send(result);
                res.end();
            }else{
                
                query = mysql.userMapper().getStatement("api", "bridge_tran_insert_key", inputData, format);
                connection.query(query, function (err, rows, fields) {
                    if(err){
                        res.send(JSON.stringify(err));
                        res.end();
                    }else{
                        if(rows.length > 0){
                            //단축URL발급
                            var enc = crypto.cipher(AppInfo.hotelCode+"/"+rows[0].RSPK+"/"+inputData.acno+"/"+inputData.rono, AppInfo.AES_KEY);
                            var url = AppInfo.httpUrl+"/ble/mobile/index?key="+enc;
                            var naverQuery = encodeURI(url);
                            var api_url = 'https://openapi.naver.com/v1/util/shorturl';
                            var request = require('request');
                            var options = {
                                url: api_url,
                                form: {'url':naverQuery},
                                headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
                            };
                            request.post(options, function (error, response, body) {
                                var jsonBody = JSON.parse(body);
                                var address = ""
                                
                                if (!error && response.statusCode == 200) {
                                    address = jsonBody.result.url
                                    
                                } else {
                                    console.log('error = ' + response.statusCode);
                                    address = naverQuery;
                                }

                                inputData.rspk = rows[0].RSPK;
                                inputData.AES_KEY = AppInfo.AES_KEY;
                                inputData.url = address;
                                inputData.key = enc
                                query = mysql.coMapper().getStatement("api", "bridge_tran_insert", inputData, format);
                                connection.query(query, function (err, rows, fields) {
                                    if(err){
                                        inputData.res = '111';
                                        res.send(JSON.stringify(inputData));
                                        res.end();
                                    }else{
                                        inputData.res = "101";
                                        var result = JSON.stringify(inputData)
                                        res.send(result);
                                        res.end();
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }
    });
   });
});
//안드로이드
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