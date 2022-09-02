const express = require('express');
const { append } = require('express/lib/response');
var router = express.Router();
const fs = require('fs')
const url = require('url');
const mysql = require("./MySQL.js");

const app = require("../app.js");

const crypto = require('./crypto');
const AppInfo = require('./AppInfo');

const http = require('http');

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
    query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
    connection.query(query, function (err, rows, fields) {
        if(err){
            console.log(err);
        }else{
            if(rows.length > 0){
                inputData.BS_NAME = rows[0].BS_NAME;
                inputData.sendTel = rows[0].BS_SEND_TEL;
                if(inputData.recancel == 'T'){
                    inputData.rspk = inputData.pk;
                    
                    query = mysql.apiMapper().getStatement("api", "bridge_tran_delete_re", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            query = mysql.apiMapper().getStatement("api", "bridge_tran_overlab", inputData, format);
                        connection.query(query, function (err, rows, fields) {
                        if(err){
                            res.send(JSON.stringify(err));
                            res.end();
                        }else{
                            if(rows.length > 0){
                                
                                var jsonObj = new Object();
                                                    
                                inputData.res = "116";
                                jsonObj.data = inputData;
                                var result = JSON.stringify(jsonObj)
                                res.send(result);
                                res.end();
            
                                inputData.tf = "F";
                                apiLog(inputData, "create");
                            }else{
                                
                                query = mysql.apiMapper().getStatement("api", "bridge_tran_insert_key", inputData, format);
                                connection.query(query, function (err, rows, fields) {
                                            if(err){
                                                res.send(JSON.stringify(err));
                                                res.end();
                                            }else{
                                                if(rows.length > 0){
                                                    //단축URL발급
                                                    var enc = crypto.cipher(inputData.bcode+"/"+rows[0].RSPK+"/"+inputData.acno+"/"+inputData.rono, AppInfo.AES_KEY);
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
                                                            query = mysql.apiMapper().getStatement("api", "bridge_tran_insert", inputData, format);
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
                                                                    try{
                                                                        AppInfo.sendSms(inputData, 1);
                                                                    }catch(ex){
                                                                        console.log(ex);
                                                                    }

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
                    query = mysql.apiMapper().getStatement("api", "bridge_tran_overlab", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            res.send(JSON.stringify(err));
                            res.end();
                        }else{
                            if(rows.length > 0){
                                inputData.rspk = rows[0].BRIDGE_TRAN_RSPK;
                                inputData.gname = rows[0].BRIDGE_TRAN_GNAME;
                                var jsonObj = new Object();
                                                    
                                inputData.res = "116";
                                jsonObj.data = inputData;
                                var result = JSON.stringify(jsonObj)
                                res.send(result);
                                res.end();
            
                                inputData.tf = "F";
                                apiLog(inputData, "create");
                            }else{
                                
                                query = mysql.apiMapper().getStatement("api", "bridge_tran_insert_key", inputData, format);
                                connection.query(query, function (err, rows, fields) {
                                    if(err){
                                        res.send(JSON.stringify(err));
                                        res.end();
                                    }else{
                                        if(rows.length > 0){
                                            //단축URL발급
                                            var enc = crypto.cipher(inputData.bcode+"/"+rows[0].RSPK+"/"+inputData.acno+"/"+inputData.rono, AppInfo.AES_KEY);
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
                                                    query = mysql.apiMapper().getStatement("api", "bridge_tran_insert", inputData, format);
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
                                                            try{
                                                                AppInfo.sendSms(inputData, 1);
                                                            }catch(ex){
                                                                console.log(ex);
                                                            }

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
            }else{
                var jsonObj = new Object();
                                    
                inputData.res = "112";
                jsonObj.data = inputData;
                var result = JSON.stringify(jsonObj)
                res.send(result);
                res.end();
            }
        }
    });
    
    
    
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
        var query;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
            }else{
                if(rows.length > 0){
                    inputData.BS_NAME = rows[0].BS_NAME;
                    inputData.sendTel = rows[0].BS_SEND_TEL;
                    query = mysql.apiMapper().getStatement("api", "bridge_tran_overlab", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                            // res.write(JSON.stringify(err));
                            // res.end();
                        }else{
                            if(rows.length > 0){
                                inputData.rspk = inputData.pk;
                                inputData.url = rows[0].BRIDGE_TRAN_URL;
                                query = mysql.apiMapper().getStatement("api", "bridge_tran_update", inputData, format);
                                connection.query(query, function (err, rows, fields) {
                                    if(err){
                                        console.log(err);
                                    }else{
                                        
                                        if(rows != undefined){
                                            try{
                                                AppInfo.sendSms(inputData, 2);
                                            }catch(ex){
                                                console.log(ex);
                                            }
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
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
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
        var query;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
            }else{
                if(rows.length > 0){
                    inputData.BS_NAME = rows[0].BS_NAME;
                    inputData.sendTel = rows[0].BS_SEND_TEL;

                    query = mysql.apiMapper().getStatement("api", "bridge_tran_overlab", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                if(rows.length > 0){
                    inputData.rspk = inputData.pk;
                    query = mysql.apiMapper().getStatement("api", "bridge_tran_delete", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                                    if(err){
                                        console.log(err);
                                    }else{
                                        
                                        if(rows != undefined){
                                            try{
                                                AppInfo.sendSms(inputData, 3);
                                            }catch(ex){
                                                console.log(ex);
                                            }
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
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
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
        var query = mysql.apiMapper().getStatement("api", "api_log_select", inputData, format);
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
 router.post('/roomCleanUpdate', function (req, res) {
    console.log("roomCleanUpdate===================");
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.apiMapper().getStatement("api", "room_clean_update", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                            // res.write(JSON.stringify(err));
                            // res.end();
                        }else{
                            var jsonObj = new Object();
                                                            
                            inputData.res = "101";
                            jsonObj.data = inputData;
                            var result = JSON.stringify(jsonObj)
                            res.send(result);
                            res.end();

                            query = mysql.apiMapper().getStatement("api", "cleaner_log_insert", inputData, format);
                            connection.query(query, function (err, rows, fields) {
                                if(err){
                                    console.log(err);
                                }else{
                                }
                            });
                        }
                    });
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
 router.post('/roomStatusUpdate', function (req, res) {
    console.log("roomStatusUpdate===================");
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.apiMapper().getStatement("api", "room_status_update", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                            // res.write(JSON.stringify(err));
                            // res.end();
                        }else{
                            var jsonObj = new Object();
                                                            
                            inputData.res = "101";
                            jsonObj.data = inputData;
                            var result = JSON.stringify(jsonObj)
                            res.send(result);
                            res.end();
                        }
                    });
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
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
    var query = mysql.apiMapper().getStatement("api", "api_log_insert_seq", data, format);
    connection.query(query, function (err, rows, fields) {
        if(err){
            console.log(err);
        }else{
            if(rows.length > 0){
                data.seq = rows[0].SEQ;
                query = mysql.apiMapper().getStatement("api", "api_log_insert", data, format);
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
    let today = new Date();   

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate(); 
    let hours = today.getHours();
    let minutes = today.getMinutes();
    var dateStr = year+""+month+""+date+""+hours+""+minutes;
    console.log(crypto.cipher("0020001/"+dateStr, AppInfo.AES_KEY));
    var inputData;
    req.on('data', (data) => {
        inputData = JSON.parse(data);
        inputData.BS_NAME = "오아시스";
        inputData.SMSTYPE = 1;
        AppInfo.sendSms(inputData);

        var returnData = {res:117};
        var jsonObj = new Object();
        jsonObj.data = returnData;
        var result = JSON.stringify(jsonObj)
        
        res.write(result);
        res.end();
    });
 });
//안드로이드
router.post('/c_login', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.apiMapper().getStatement("api", "select_user_admin", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                            // res.write(JSON.stringify(err));
                            // res.end();
                        }else{
                            var jsonObj = new Object();
                            if(rows.length == 0){
                                rows.res = "101";
                            }else{
                                rows[0].res = "101";
                            }  
                            
                            jsonObj.data = rows;
                            var result = JSON.stringify(jsonObj)
                            res.send(result);
                            res.end();
                        }
                    });
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
router.post('/clean_action_list', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.apiMapper().getStatement("api", "app_cleaner_log_total", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        
                        if(err){
                            console.log("에러닷!!!");
                            console.log(err);
                            // res.write(JSON.stringify(err));
                            // res.end();
                        }else{
                                
                            var counts = rows.length;
                            query = mysql.apiMapper().getStatement("api", "app_cleaner_log", inputData, format);
                            connection.query(query, function (err, rows, fields) {
                                if(err){
                                    console.log(err);
                                    // res.write(JSON.stringify(err));
                                    // res.end();
                                }else{
                                    var jsonObj = new Object();
                                    if(rows.length > 0){
                                        rows[0].counts = counts;
                                    }
                                    jsonObj.data = rows;
                                    var result = JSON.stringify(jsonObj)
                                    res.send(result);
                                    res.end();
                                }
                            });
                            
                        }
                    });
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
 router.post('/room_default', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                var jsonObj = new Object();
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.apiMapper().getStatement("api", "room_floor_select", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            jsonObj.floor = rows;

                            query = mysql.apiMapper().getStatement("api", "room_status_code", inputData, format);
                            connection.query(query, function (err, rows, fields) {
                                if(err){
                                    console.log(err);
                                }else{
                                    jsonObj.status = rows;
                                    var result = JSON.stringify(jsonObj)
                                    res.send(result);
                                    res.end();
                                }
                            });
                        }
                    });
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
 router.post('/room_main_list', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                var jsonObj = new Object();
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.apiMapper().getStatement("api", "room_main_list", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            jsonObj.data = rows;
                            var result = JSON.stringify(jsonObj)
                            res.send(result);
                            res.end();
                        }
                    });
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
 router.post('/room_set_stau', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                var jsonObj = new Object();
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.apiMapper().getStatement("api", "room_clean_update", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            query = mysql.apiMapper().getStatement("api", "cleaner_log_insert", inputData, format);
                            connection.query(query, function (err, rows, fields) {
                                if(err){
                                    console.log(err);
                                }else{
                                    var jsonObj = new Object();
                                    var resData = {};
                                    resData.res = "101"
                                    jsonObj.data = resData;
                                    var result = JSON.stringify(jsonObj)
                                    res.send(result);
                                    res.end();

                                    //pms에도 보내줌
                                    var api_url = AppInfo.pmsUrl+"/api/app/room_set_stau.do";
                                    var request = require('request');
                                    var options = {
                                        url: api_url,
                                        method:'POST',
                                        form:inputData
                                    };
                                    request.post(options, function (error, response, body) {
                                        console.log(body);
                                        if (!error && response.statusCode == 200) {
                                        } else {
                                            console.log('error = ' + response.statusCode);
                                        }
                                    });
                                }
                            });
                        }
                    });
                    
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
 router.post('/door_time_check', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                var jsonObj = new Object();
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.mqttMapper().getStatement("mqtt", "door_time_check", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            jsonObj.data = rows;
                            var result = JSON.stringify(jsonObj)
                            res.send(result);
                            res.end();
                        }
                    });
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
 router.post('/admin_pass_select', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                var jsonObj = new Object();
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.mqttMapper().getStatement("mqtt", "admin_pass_select", inputData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            jsonObj.data = rows;
                            var result = JSON.stringify(jsonObj)
                            res.send(result);
                            res.end();
                        }
                    });
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
 router.post('/app_action_insert', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                var formData = appActionDataForm(inputData);
                var jsonObj = new Object();
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                    query = mysql.apiMapper().getStatement("api", "mqtt_log_insert_api", formData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            formData.insertId = rows.insertId;
                            query = mysql.apiMapper().getStatement("api", "mqtt_action_insert_api", formData, format);
                            connection.query(query, function (err, rows, fields) {
                                if(err){
                                    console.log(err);
                                }else{

                                    
                                    var resData = {};
                                    resData.insertId = rows.insertId;
                                    jsonObj.data = rows;
                                    var result = JSON.stringify(jsonObj)
                                    res.send(result);
                                    res.end();
                                }
                            });
                        }
                    });
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
 router.post('/app_action_rec', function (req, res) {
    var inputData;
    req.on('data', (data) => {
    
        inputData = JSON.parse(data);
        var format = {language: 'sql', indent: '  '};
        var query ;
        query = mysql.coMapper().getStatement("co", "bs_select", inputData, format);
        connection.query(query, function (err, rows, fields) {
            if(err){
                console.log(err);
                // res.write(JSON.stringify(err));
                // res.end();
            }else{
                var formData = appActionDataForm(inputData);
                var jsonObj = new Object();
                res.setHeader('Content-Type', 'application/json');
                //시간설정일때
                if(formData.cmd == "5"){
                    doorTimeSett(inputData);
                }
                if(formData.cmd == "12"){
                    doorTimeSett(inputData);
                }
                if(rows.length > 0){
                    query = mysql.apiMapper().getStatement("api", "mqtt_log_insert_api", formData, format);
                    connection.query(query, function (err, rows, fields) {
                        if(err){
                            console.log(err);
                        }else{
                            query = mysql.apiMapper().getStatement("api", "mqtt_action_update_api", formData, format);
                            connection.query(query, function (err, rows, fields) {
                                if(err){
                                    console.log(err);
                                }else{
                                    jsonObj.data = rows;
                                    var result = JSON.stringify(jsonObj)
                                    res.send(result);
                                    res.end();
                                }
                            });
                        }
                    });
                    
                }else{
                    var jsonObj = new Object();
                                        
                    inputData.res = "112";
                    jsonObj.data = inputData;
                    var result = JSON.stringify(jsonObj)
                    res.send(result);
                    res.end();
                }
            }
        });
        
    });
 });
 function doorTimeSett(data){
    var format = {language: 'sql', indent: '  '};
    var query ;
    console.log("doorTimeSett =============>");
    var pass = data.pass;
    var cleaner = data.cleaner;
    var master = data.master;
    var doorTime = data.doorTime;
    var passTime = data.passTime;
    var user = data.user;
    var admin = data.admin;
    
    if(pass == undefined) pass = "";
    if(cleaner == undefined) cleaner = "";
    if(master == undefined) master = "";
    if(doorTime == undefined){
      doorTime = "";
    }
    if(passTime == undefined){
      passTime = "";
    }
    if(user == undefined) user = "";
    if(admin == undefined) admin = "";
    
    var input = {};
    input = {
      pass: pass,
      cleaner: cleaner,
      master: master,
      doorTime: doorTime,
      passTime: passTime,
      user: user,
      admin: admin,
      rono: data.rono,
      bsCode: data.bsCode,
      rono : data.rono
    }
    
    var query = mysql.mqttMapper().getStatement("mqtt", "door_time_check", input, format);
    
      connection.query(query, function (err, rows, fields) {
        if(err){
          console.log(err);
        }else{
            if(rows.length > 0){
              query = mysql.mqttMapper().getStatement("mqtt", "door_sett_update", input, format);
              connection.query(query, function (err, rows, fields) {
                if(err){
                  console.log(err);
                }else{
                }
              });
            }else{
              
              query = mysql.mqttMapper().getStatement("mqtt", "door_sett_insert", input, format);
              connection.query(query, function (err, rows, fields) {
                if(err){
                  console.log(err);
                }else{
                }
              });
            }
        }
      });
 }
 function appActionDataForm(jsonData){
    
    var actionKey = undefined;

    var hotel = jsonData.hotel;
    var num = jsonData.num;
    var state = jsonData.state;
    var ver = jsonData.ver;
    var serverip = jsonData.serverip;
    var port = jsonData.port;
    var cmd = jsonData.cmd;
    var type = jsonData.type;
    var serial = jsonData.serial;
    var userId = jsonData.userId;
    var hd = jsonData.hd;
    var recIp = jsonData.recIp;
    var open = jsonData.open;
    var remark = jsonData.remark;
    var insertId = jsonData.insertId;

    if(hotel == undefined) hotel = "";
    if(num == undefined) num = "";
    if(state == undefined) state = "";
    if(ver == undefined) ver = "";
    if(serverip == undefined) serverip = "";
    if(port == undefined) port = "";
    if(cmd == undefined) cmd = "";
    if(type == undefined) type = "";
    if(serial == undefined) serial = "";
    if(insertId == undefined) insertId = 0;
    if(userId == undefined) userId = "auto";
    if(recIp == undefined) recIp = "";
    if(open == undefined) open = "";
    if(remark == undefined) remark = "";

    var data = {};

    data = {
        hotel: hotel,
        num : num,
        state: state,
        serial: serial,
        ver: ver,
        serverip: serverip,
        port: port,
        cmd: cmd,
        type : type,
        state: state,
        insertId: insertId,
        userId : userId,
        hd : hd,
        recIp: recIp,
        open: open,
        remark: remark
    };
    return data;
 }
module.exports = router;