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
   var resData;
   req.on('data', (data) => {
    
    inputData = JSON.parse(data);
    resData = JSON.parse(data);
    console.log(inputData);
    var format = {language: 'sql', indent: '  '};
    var query;
    if(inputData.recancel == 'T'){
        inputData.rspk = inputData.pk;
        query = mysql.userMapper().getStatement("api", "bridge_tran_delete", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
            }else{
                query = mysql.userMapper().getStatement("api", "bridge_tran_overlab", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                res.send(JSON.stringify(err));
                res.end();
            }else{
                if(rows.length > 0){
                    inputData.rspk = rows[0].BRIDGE_TRAN_RSPK;
                    inputData.gname = rows[0].BRIDGE_TRAN_RSPK;
                    inputData.idate = rows[0].BRIDGE_TRAN_RSPK;
                    inputData.odate = rows[0].BRIDGE_TRAN_RSPK;
                    
                    var jsonObj = new Object();
                                        
                    inputData.res = "116";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();

                    inputData.tf = "F";
                    apiLog(inputData, "create");
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
                                            
                                            
                                        
                                            inputData.pk = rows[0].RSPK;
                                            inputData.rspk = rows[0].RSPK;
                                            inputData.url = address;
                                            inputData.key = enc;
                                            inputData.AES_KEY = AppInfo.AES_KEY;

                                            resData.pk = rows[0].RSPK;
                                            resData.url = address;
                                            resData.key = enc;



                                            
                                            try{
                                                query = mysql.coMapper().getStatement("api", "bridge_tran_insert", inputData, format);
                                                connection.query(query, function (err, rows, fields) {
                                                    if(err){
                                                        var jsonObj = new Object();
                                                
                                                        resData.res = "111";
                                                        jsonObj.data = resData;
                                                        res.send(JSON.stringify(jsonObj));
                                                        res.end();
                                                        resData.tf = "F";
                                                        apiLog(resData, "create");
                                                    }else{
                                                        var jsonObj = new Object();
                                                
                                                        resData.res = "101";
                                                        jsonObj.data = resData;
                                                        var result = JSON.stringify(jsonObj)
                                                        res.send(result);
                                                        res.end();
                                                        resData.tf = "T";
                                                        apiLog(resData, "create");
                                                    }
                                                });
                                            }catch(ex){
                                                var jsonObj = new Object();
                                                
                                                resData.res = "113";
                                                jsonObj.data = resData;
                                                var result = JSON.stringify(jsonObj)
                                                res.send(jsonObj);
                                                res.end();
                                                resData.tf = "F";
                                                apiLog(resData, "create");
                                            }
                                            
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }else{
        query = mysql.userMapper().getStatement("api", "bridge_tran_overlab", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                res.send(JSON.stringify(err));
                res.end();
            }else{
                if(rows.length > 0){
                    inputData.rspk = rows[0].BRIDGE_TRAN_RSPK;
                    inputData.gname = rows[0].BRIDGE_TRAN_RSPK;
                    inputData.idate = rows[0].BRIDGE_TRAN_RSPK;
                    inputData.odate = rows[0].BRIDGE_TRAN_RSPK;
                    
                    var jsonObj = new Object();
                                        
                    inputData.res = "116";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();

                    inputData.tf = "F";
                    apiLog(inputData, "create");
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
                                    
                                    
                                
                                    inputData.pk = rows[0].RSPK;
                                    inputData.rspk = rows[0].RSPK;
                                    inputData.url = address;
                                    inputData.key = enc;
                                    inputData.AES_KEY = AppInfo.AES_KEY;

                                    resData.pk = rows[0].RSPK;
                                    resData.url = address;
                                    resData.key = enc;



                                    
                                    try{
                                        query = mysql.coMapper().getStatement("api", "bridge_tran_insert", inputData, format);
                                        connection.query(query, function (err, rows, fields) {
                                            if(err){
                                                var jsonObj = new Object();
                                        
                                                resData.res = "111";
                                                jsonObj.data = resData;
                                                res.send(JSON.stringify(jsonObj));
                                                res.end();
                                                resData.tf = "F";
                                                apiLog(resData, "create");
                                            }else{
                                                var jsonObj = new Object();
                                        
                                                resData.res = "101";
                                                jsonObj.data = resData;
                                                var result = JSON.stringify(jsonObj)
                                                res.send(result);
                                                res.end();
                                                resData.tf = "T";
                                                apiLog(resData, "create");
                                            }
                                        });
                                    }catch(ex){
                                        var jsonObj = new Object();
                                        
                                        resData.res = "113";
                                        jsonObj.data = resData;
                                        var result = JSON.stringify(jsonObj)
                                        res.send(jsonObj);
                                        res.end();
                                        resData.tf = "F";
                                        apiLog(resData, "create");
                                    }
                                    
                                });
                            }
                        }
                    });
                }
            }
        });
    }
    
    
   });
});
router.post('/apiKeyUpdate', function (req, res) {
    var inputData;
    var resData;
    req.on('data', (data) => {
        res.setHeader('Content-Type', 'application/json');
        inputData = JSON.parse(data);
        resData = JSON.parse(data);
        console.log(inputData);
        var format = {language: 'sql', indent: '  '};
        var query = mysql.userMapper().getStatement("api", "bridge_tran_overlab", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                if(rows.length > 0){
                    inputData.rspk = inputData.pk;
                    query = mysql.userMapper().getStatement("api", "bridge_tran_update", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            
                            if(rows != undefined){
                                resData.tf = "T";
                                resData.res = "101";
                                var jsonObj = new Object();
                                jsonObj.data = resData;
                                var result = JSON.stringify(jsonObj)
                                res.write(result);
                                res.end();
                                apiLog(resData, "update");
                            }else{
                                resData.tf = "F";
                                resData.res = "113";
                                var jsonObj = new Object();
                                jsonObj.data = resData;
                                var result = JSON.stringify(jsonObj)
                                res.write(result);
                                res.end();
                                apiLog(resData, "update");
                            }
                        }
                    });

                }else{
                    resData.tf = "F";
                    resData.res = "117";
                    var jsonObj = new Object();
                    jsonObj.data = resData;
                    var result = JSON.stringify(jsonObj)
                    res.write(result);
                    res.end();
                    apiLog(resData, "update");
                }
            }
        });
    });
 });
 router.post('/apiKeyDelete', function (req, res) {
    var inputData;
    var resData;
    req.on('data', (data) => {
        res.setHeader('Content-Type', 'application/json');
        inputData = JSON.parse(data);
        resData = JSON.parse(data);
        console.log(inputData);
        var format = {language: 'sql', indent: '  '};
        var query = mysql.userMapper().getStatement("api", "bridge_tran_overlab", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                if(rows.length > 0){
                    inputData.rspk = inputData.pk;
                    query = mysql.userMapper().getStatement("api", "bridge_tran_delete", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            
                            if(rows != undefined){
                                resData.tf = "T";
                                resData.res = "101";
                                var jsonObj = new Object();
                                jsonObj.data = resData;
                                var result = JSON.stringify(jsonObj)
                                res.write(result);
                                res.end();
                                apiLog(resData, "delete");
                            }else{
                                resData.tf = "F";
                                resData.res = "113";
                                var jsonObj = new Object();
                                jsonObj.data = resData;
                                var result = JSON.stringify(jsonObj)
                                res.write(result);
                                res.end();
                                apiLog(resData, "delete");
                            }
                        }
                    });

                }else{
                    resData.tf = "F";
                    resData.res = "117";
                    var jsonObj = new Object();
                    jsonObj.data = resData;
                    var result = JSON.stringify(jsonObj)
                    res.write(result);
                    res.end();
                    apiLog(resData, "update");
                }
            }
        });
    });
 });
router.post('/apiKeyPlogSearch', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        inputData.AES_KEY = AppInfo.AES_KEY;
        var format = {language: 'sql', indent: '  '};
        var query = mysql.userMapper().getStatement("api", "api_log_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                res.setHeader('Content-Type', 'application/json');
                
                var jsonObj = new Object();
                                    
                jsonObj.list = rows;
                var result = JSON.stringify(jsonObj)
                
                res.write(result);
                res.end();
            }
        });
    });
 });

 function apiLog(data, type){
    data.AES_KEY = AppInfo.AES_KEY;
    data.type = type;

    var url = data.url;
    if(url == undefined ){data.url = '';}

    var format = {language: 'sql', indent: '  '};
    var query = mysql.userMapper().getStatement("api", "api_log_insert_seq", data, format);
    connection.query(query, function (err, rows, fields) {
        if(err){
            console.log(err);
        }else{
            if(rows.length > 0){
                data.seq = rows[0].SEQ;
                query = mysql.userMapper().getStatement("api", "api_log_insert", data, format);
                connection.query(query, function (err, rows, fields) {
                    if(err){
                        console.log(err);
                    }else{
                        if(rows.length > 0){
                        }
                    }
                });
            }
        }
    });
 }
 router.post('/test', function (req, res) {
    console.log("aaa");
    var inputData;
    req.on('data', (data) => {
        inputData = JSON.parse(data);
        AppInfo.sendSms(data);

        var returnData = {res:117};
        var jsonObj = new Object();
        jsonObj.data = returnData;
        var result = JSON.stringify(jsonObj)
        
        res.write(result);
        res.end();
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