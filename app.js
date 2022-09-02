const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const app = express()
const socket = require('socket.io')
const ejs = require('ejs');

const http = require('http')
const url = require('url');
const fs = require('fs')


const server = http.createServer(app)
const io = socket(server)
const path = require('path');

var cookieParser = require('cookie-parser')

app.use(cookieParser())

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const multer = require('multer');


var fileUploadRouter = require('./module/file');

const AppInfo = require('./module/AppInfo');

//경로 설정
app.use(express.static(path.join(__dirname, 'static')));
app.use('/local', express.static('./static/local'))
app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))
app.use('/img', express.static('./static/img'))
app.use('/routes', express.static('./static/routes'))
app.use('/upload', fileUploadRouter);
app.use('/file', express.static('./upload'));


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.set('layout', '', '')
app.use(expressLayouts);


//세션연결
var fileStoreOptions = {
    path: "./sessions",
    reapInterval: 120
  };
var sessionMiddle = session({ 
    secret: 'test cat',  // 암호화
    resave: false,
    saveUninitialized: true,
    store: new FileStore(fileStoreOptions),
    cookie: { maxAge: 28 * 24 * 60 * 60 * 1000 } // 4 week
  })
  app.use(sessionMiddle);

//세션 전역변수화
var appendLocalsToUseInViews = function(req, res, next)
{            
    res.locals.session = req.session;
    next(null, req, res);
}
app.use(appendLocalsToUseInViews);

/*
mqtt 연결설정
*/
const mqtt = require('mqtt');
const { MqttClient } = require('mqtt');
//mqtt 연결 주소


const options = {
    username:"user",
    password:"1234",
};
//mqtt 연결
const client = mqtt.connect(AppInfo.mqttUrl, options);
//받은 서버 아이피
var os = require('os');

  

function getServerIp() {
    var ifaces = os.networkInterfaces();
    var result = '';
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4' && details.internal === false) {
                result = details.address;
                ++alias;
            }
        });
    }
    return result;

}



client.subscribe("esp32/#")

client.on("message", function(topic, message){
    console.log("rec =====>");
    
    console.log(`토픽:${topic.toString()}, 메세지:${message.toString()}`);

    let ms = JSON.parse(message.toString());
    var num = topic.toString().replace("esp32/", "");
    if(ms.state == true){
        ms.state = "1";
    }else if(ms.state == false){
        ms.state = "0";
    }
    if(ms.cmd != "211" && ms.cmd != "204" && ms.cmd != "210"){
        var hex = ms.cmd;
        console.log(ms.cmd + " / " + parseInt(hex, 16));
        ms.cmd = String(parseInt(hex, 16));
    }
    
    // if(ms.cmd == "c"){
    //     ms.cmd = "12";
    // }else if(ms.cmd == "f"){
    //     ms.cmd = "15";
    // }
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.type = "rec";
    ms.recIp = getServerIp();
    // console.log(ms);
    queryModule.insertMqttLog(ms);

    var roomUser = null;
    for(var i=0; i<AppInfo.roomArray.length; i++){
        if(AppInfo.roomArray[i].rmName == "rm_"+ms.hotel+"_"+ms.num){
            roomUser = AppInfo.roomArray[i]
        }
    }
    

    if(roomUser == null){
        for(var i=0; i<AppInfo.adminRoomArray.length; i++){
            if(AppInfo.adminRoomArray[i].rmName == "rm_"+ms.hotel+"_"+ms.num){
                roomUser = AppInfo.adminRoomArray[i]
            }
        }
    }
    if(ms.cmd == "255"){
        console.log("와이파이 연결");
    }else if(ms.cmd == "210"){
        console.log("BLE 연결");
        var msg = "";
        if(ms.state == "1"){
            msg = "connect"
        }else if(ms.state == "2"){
            msg = "disconnect"
        }else if(ms.state == "3"){
            msg = "scanstop"
        }
        if(roomUser != null){
            io.to(roomUser.rmName).emit("ble", {
                msg : msg
            });
        }
        
    }else if(ms.cmd == "211"){
        console.log("MQTT 연결");
        var msg = "";
        msg = "mqttConnect",
        state = ms.state
        if(roomUser != null){
            io.to(roomUser.rmName).emit("ble", {
                msg : msg,
                state:state
            });
        }
        
    }else if(ms.cmd == "129"){
        console.log("BLE OPEN");
        var msg = "open";
        state = ms.state
        if(roomUser != null){
            io.to(roomUser.rmName).emit("ble", {
                msg : msg,
                state:state
            });
        }
        
    }else if(ms.cmd == "5"){
        console.log("BLE DOOR TIME");
        var msg = "doorTimeSett";
        state = ms.state
        if(roomUser != null){
            io.to(roomUser.rmName).emit("ble", {
                msg : msg,
                state:state
            });
        }
        
    }else if(ms.cmd == "12"){
        console.log("BLE PASS TIME");
        var msg = "passTimeSett";
        state = ms.state
        if(roomUser != null){
            io.to(roomUser.rmName).emit("ble", {
                msg : msg,
                state:state
            });
        }
        
    }else if(ms.cmd == "15"){
        console.log("BLE PASS SETT");
        var msg = "passSett";
        state = ms.state
        if(roomUser != null){
            io.to(roomUser.rmName).emit("ble", {
                msg : msg,
                state:state
            });
        }
    }else if(ms.cmd == "23"){
        console.log("BLE MASTER SETT");
        var msg = "masterPassSett";
        state = ms.state
        if(roomUser != null){
            io.to(roomUser.rmName).emit("ble", {
                msg : msg,
                state:state
            });
        }
    }else if(ms.cmd == "24"){
        console.log("BLE MAID SETT");
        var msg = "maidPassSett";
        state = ms.state
        console.log(roomUser);
        if(roomUser != null){
            io.to(roomUser.rmName).emit("ble", {
                msg : msg,
                state:state
            });
        }
    }
})


//모듈 설정
const openerMobileModule = require('./module/BleMobileModule.js')
app.use('/ble/mobile', openerMobileModule)
const openerAdminModule = require('./module/BleAdminModule.js')
app.use('/ble/admin', openerAdminModule)
const ApiReceiveModule = require('./module/ApiReceive.js')
app.use('/api/rec', ApiReceiveModule)

const mysql = require("./module/MySQL.js")
const mqttModule = require('./module/MqttData.js')
const queryModule = require('./module/Query.js')
const { timeStamp } = require('console');
const { query } = require('express');


//기본 접속 경로
app.get('/', function(req, res) {
    var filter = "win16|win32|win64|macintel|mac|"; // PC일 경우 가능한 값
    res.redirect("/ble/admin/login")
    // if (req.header('user-agent').indexOf('Mobile') != -1) {
    //     res.redirect("/ble/mobile/login")
    // } else {
    //     res.redirect("/ble/admin/login")
    // }
    
})
app.get('/socket/room', function(req, res) {
    var uri = req.url;
    var data = url.parse(uri, true).query;
    var resData = {};
    
    var roomCount = 0;
    for(var i=0; i<AppInfo.roomArray.length; i++){
        if(AppInfo.roomArray[i].rmName == "rm_"+data.name){
            console.log(AppInfo.roomArray[i]);
            roomCount++;
            resData.admin = "0";
        }
    }
    for(var i=0; i<AppInfo.adminRoomArray.length; i++){
        if(AppInfo.adminRoomArray[i].rmName == "rm_"+data.name){
            console.log(AppInfo.adminRoomArray[i]);
            roomCount++;
            resData.admin = "1";
        }
    }
    resData.room_size = roomCount;
    res.setHeader('Content-Type', 'application/json');
    var result = JSON.stringify(resData)
    res.send(result);
    res.end();
})

const connection = mysql.connection()

app.get('/mysql/user', function (req, res) {
    var uri = req.url;
    var data = url.parse(uri, true).query;
    var format = {language: 'sql', indent: '  '};
    var xml_name = data.xml;
    console.log(data);
    var query = mysql.userMapper().getStatement("user", xml_name, data, format);
    connection.query(query, function (err, rows, fields) {
        if(err){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(err));
            res.end();
        }else{
            res.setHeader('Content-Type', 'application/json');
            var result = JSON.stringify(rows)
            res.send(result);
            res.end();
        }
    });
});

app.get('/mysql/chat', function (req, res) {
    var uri = req.url;
    var data = url.parse(uri, true).query;
    var format = {language: 'sql', indent: '  '};
    var xml_name = data.xml;
    
    var query = mysql.chatMapper().getStatement("chat", xml_name, data, format);
    
    connection.query(query, function (err, rows, fields) {
        if(err){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(err));
            res.end();
        }else{
            res.setHeader('Content-Type', 'application/json');
            var result = JSON.stringify(rows)
            res.send(result);
            res.end();
        }
    });
});
app.get('/mysql/common', function (req, res) {
    var uri = req.url;
    var data = url.parse(uri, true).query;
    var format = {language: 'sql', indent: '  '};
    var xml_name = data.xml;
    var query = mysql.commonMapper().getStatement("common", xml_name, data, format);
    
    connection.query(query, function (err, rows, fields) {
        if(err){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(err));
            res.end();
        }else{
            res.setHeader('Content-Type', 'application/json');
            var result = JSON.stringify(rows)
            res.send(result);
            res.end();
        }
    });
});
app.get('/mysql/room', function (req, res) {
    var uri = req.url;
    var data = url.parse(uri, true).query;
    data.AES_KEY = AppInfo.AES_KEY;
    var format = {language: 'sql', indent: '  '};
    var xml_name = data.xml;
    var query = mysql.roomMapper().getStatement("room", xml_name, data, format);
    connection.query(query, function (err, rows, fields) {
        if(err){
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(err));
            res.end();
        }else{
            res.setHeader('Content-Type', 'application/json');
            var result = JSON.stringify(rows)
            res.send(result);
            res.end();
        }
    });
});
app.get('/mysql/mqtt', function (req, res) {
    var uri = req.url;
    var data = url.parse(uri, true).query;
    var format = {language: 'sql', indent: '  '};
    var xml_name = data.xml;
    var query = mysql.commonMapper().getStatement("mqtt", xml_name, data, format);
    connection.query(query, function (err, rows, fields) {
        if(err){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(err));
            res.end();
        }else{
            res.setHeader('Content-Type', 'application/json');
            var result = JSON.stringify(rows)
            res.send(result);
            res.end();
        }
    });
});


/*
* socketIo
*/
//소켓에 세션 추가
io.use(function(socket, next){
    sessionMiddle(socket.request, socket.request.res || {}, next);
});


io.sockets.on("connection", function(socket){
    console.log("socket connect ===>");
    socket.on("error", function(err){
        console.log("err : ", err);
    });
    socket.on("send", function(data){
        console.log("전달 메세지 : ", data);
    });
    socket.on("disconnect", function(){
        console.log("접속 종료" + socket.id);
        var mainKey = "";

        for(var i=0; i<AppInfo.roomArray.length; i++){
            if(AppInfo.roomArray[i].id == socket.id){
                mainKey = AppInfo.roomArray[i].mainKey;
                AppInfo.roomArray.splice(i,1);
                socket.leave("rm_"+mainKey);
            }
        }
        for(var i=0; i<AppInfo.adminRoomArray.length; i++){
            if(AppInfo.adminRoomArray[i].id == socket.id){ 
                mainKey = AppInfo.adminRoomArray[i].mainKey;
                AppInfo.adminRoomArray.splice(i,1);
                socket.leave("rm_"+mainKey);
            }
        }
        for(var i=0; i<AppInfo.adminSocketArray.length; i++){
            if(AppInfo.adminSocketArray[i].id == socket.id){ 
                var bsCode = AppInfo.adminSocketArray[i].bsCode;
                AppInfo.adminSocketArray.splice(i,1);
                socket.leave("rm_"+bsCode);
            }
        }
    });
    socket.on("adminRoomDisConnect", function(){
        console.log("adminRoomDisConnect " + socket.id);
        var mainKey = "";

        for(var i=0; i<AppInfo.adminRoomArray.length; i++){
            if(AppInfo.adminRoomArray[i].id == socket.id){ 
                mainKey = AppInfo.adminRoomArray[i].mainKey;
                AppInfo.adminRoomArray.splice(i,1);
                socket.leave("rm_"+mainKey);
            }
        }
    });
    // 소켓 방접속
    socket.on("joinMain", (bsCode, userId, userName) => {
        socket.join("admin_"+bsCode);

        var obj = new Object();
        obj.id = socket.id;
        obj.userId = userId;
        obj.userName = userName;
        obj.bsCode = bsCode;

        AppInfo.adminSocketArray.push(obj);
    });
    // 소켓 방접속
    socket.on("joinAdmin", (main_key, user, admin) => {
        socket.join("rm_"+main_key);

        var obj = new Object();
        obj.id = socket.id;
        obj.user = user;
        obj.mainKey = main_key;
        obj.rmName = 'rm_'+main_key;
        obj.admin = admin

        AppInfo.adminRoomArray.push(obj);
    });
    socket.on("joinRoom", (main_key, user, admin) => {
        
        socket.join("rm_"+main_key)
        var obj = new Object();
        obj.id = socket.id;
        obj.user = user;
        obj.mainKey = main_key;
        obj.rmName = 'rm_'+main_key;
        obj.admin = admin

        

        AppInfo.roomArray.push(obj);
        //room접속 로그
        var data = {};
        data = {
            user:user,
            mainKey: main_key,
            admin: admin,
            socket: socket.id
        }
        
        // var format = {language: 'sql', indent: '  '};
        // var query = mysql.chatMapper().getStatement("chat", "chat_room_insert", data, format);
        // connection.query(query, function (err, rows, fields) {
        //     if(err){
        //         console.log(err)
        //     }else{
        //     }
        // });
    })
    //채팅 메세지
    socket.on("msg", function(data){
        console.log(data);
        
        if(data.rm == undefined){
            io.to("admin").emit("refresh", data);
        }else{
            io.to(data.rm).emit("recvChat", {
                msg : data.msg,
                userId: data.userId,
                admin: data.admin,
                date: data.date,
                userName: data.userName,
                imgName: data.imgName,
                imgPath: data.imgPath
            });
            io.to("admin").emit("refresh", "msgSend");
        }
        
        
    });
})

//채팅 인서트
app.get('/mysql/insertChat', function (req, res) {
    var uri = req.url;
    var data = url.parse(uri, true).query;
    var format = {language: 'sql', indent: '  '};
    var xml_name = data.xml;
    var query = mysql.chatMapper().getStatement("chat", xml_name, data, format);
    connection.query(query, function (err, rows, fields) {
        if(err){
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(err));
            res.end();
        }else{
            var insertId = rows.insertId;
            data = {insertId: insertId};
            query = mysql.chatMapper().getStatement("chat", "select_chat_server_time", data, format);
            
            connection.query(query, function (err, rows, fields) {
                if(err){
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(err));
                    res.end();
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    var result = JSON.stringify(rows)
                    res.send(result);
                    res.end();
                }
            });
        }
    });
});
//ble command
app.get('/doorTime', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    var jsonData;
    jsonData = JSON.stringify(mqttModule.doorTime());
    client.publish(query.topic, jsonData, {qos:2})

    let ms = JSON.parse(jsonData);
    var num = query.topic.toString().replace("oasyss32/", "");
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.cmd = mqttModule.doorTime()[0];
    ms.state = mqttModule.doorTime()[1];
    ms.type = "send";
    ms.userId = query.userId;
    ms.hd = "wifi";
    ms.recIp = getServerIp();
    ms.open = query.open;
    queryModule.insertMqttLog(ms)

    response.send(query);

})
app.get('/doorOn', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    var jsonData;
    jsonData = JSON.stringify(mqttModule.doorOpen());
    client.publish(query.topic, jsonData, {qos:2})

    let ms = JSON.parse(jsonData);
    var num = query.topic.toString().replace("oasyss32/", "");
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.cmd = mqttModule.doorOpen()[0];
    ms.state = mqttModule.doorOpen()[1];
    ms.type = "send";
    ms.userId = query.userId;
    ms.hd = "wifi";
    ms.recIp = getServerIp();
    ms.open = query.open;
    queryModule.insertMqttLog(ms)

    response.send(query);
})
app.get('/doorTimeSett', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    var jsonData;
    jsonData = JSON.stringify(mqttModule.doorTime());
    client.publish(query.topic, jsonData, {qos:2})

    let ms = JSON.parse(jsonData);
    var num = query.topic.toString().replace("oasyss32/", "");
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.cmd = mqttModule.doorTime()[0];
    ms.state = mqttModule.doorTime()[1];
    ms.type = "send";
    ms.userId = query.userId;
    ms.hd = "wifi";
    ms.recIp = getServerIp();
    ms.open = query.open;
    queryModule.insertMqttLog(ms)

    response.send(query);
})
app.get('/passTimeSett', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    var date = query.date;
    date = date.replace(/-/gi, "");
    date = date.replace(/ /gi, "");
    date = date.replace(/PM/gi, "");
    date = date.replace(/AM/gi, "");
    date = date.replace(/:/gi, "");
    var jsonData;
    jsonData = JSON.stringify(mqttModule.doorPassTime(date));
    client.publish(query.topic, jsonData, {qos:2})

    let ms = JSON.parse(jsonData);
    var num = query.topic.toString().replace("oasyss32/", "");
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.cmd = 204;
    ms.state = 12;
    ms.type = "send";
    ms.userId = query.userId;
    ms.hd = "wifi";
    ms.recIp = getServerIp();
    ms.open = query.open;
    queryModule.insertMqttLog(ms)

    response.send(query);
})
app.get('/passSett', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    var jsonData;
    jsonData = JSON.stringify(mqttModule.doorPass(query.pass));
    client.publish(query.topic, jsonData, {qos:2})

    let ms = JSON.parse(jsonData);
    var num = query.topic.toString().replace("oasyss32/", "");
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.cmd = 204;
    ms.state = 15;
    ms.type = "send";
    ms.userId = query.userId;
    ms.hd = "wifi";
    ms.recIp = getServerIp();
    ms.open = query.open;
    ms.remark = query.pass;
    queryModule.insertMqttLog(ms)

    response.send(query);
})
app.get('/maidPassSett', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    var jsonData;
    jsonData = JSON.stringify(mqttModule.doorPassMaid(query.pass));
    client.publish(query.topic, jsonData, {qos:2})

    let ms = JSON.parse(jsonData);
    var num = query.topic.toString().replace("oasyss32/", "");
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.cmd = 204;
    ms.state = 24;
    ms.type = "send";
    ms.userId = query.userId;
    ms.hd = "wifi";
    ms.recIp = getServerIp();
    ms.open = query.open;
    ms.remark = query.pass;
    queryModule.insertMqttLog(ms)

    response.send(query);
})
app.get('/masterPassSett', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    var jsonData;
    jsonData = JSON.stringify(mqttModule.doorPassMaster(query.pass));
    client.publish(query.topic, jsonData, {qos:2})

    let ms = JSON.parse(jsonData);
    var num = query.topic.toString().replace("oasyss32/", "");
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.cmd = 204;
    ms.state = 23;
    ms.type = "send";
    ms.userId = query.userId;
    ms.hd = "wifi";
    ms.recIp = getServerIp();
    ms.open = query.open;
    ms.remark = query.pass;
    queryModule.insertMqttLog(ms)

    response.send(query);
})

app.get('/mqttCheck', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;

    var jsonData;
    jsonData = JSON.stringify(mqttModule.mqttCheck());
    client.publish(query.topic, jsonData, {qos:2})

    let ms = JSON.parse(jsonData);
    var num = query.topic.toString().replace("oasyss32/", "");
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.cmd = mqttModule.mqttCheck()[0];
    ms.state = mqttModule.mqttCheck()[1];
    ms.type = "send";
    ms.userId = query.userId;
    ms.hd = "wifi";
    ms.recIp = getServerIp();
    ms.open = query.open;
    queryModule.insertMqttLog(ms)
    response.send(query);

})
app.get('/bleConnect', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    console.log("bleConnect ====>" + query.topic);
    var jsonData;
    jsonData = JSON.stringify(mqttModule.bleConnect(query.rono));
    client.publish(query.topic, jsonData, {qos:2})

    let ms = JSON.parse(jsonData);
    var num = query.topic.toString().replace("oasyss32/", "");
    num = num.split('/');
    ms.hotel = num[0];
    ms.num = num[1];
    ms.cmd = mqttModule.bleConnect(query.rono)[0];
    ms.state = mqttModule.bleConnect(query.rono)[1];
    ms.type = "send";
    ms.userId = query.userId;
    ms.hd = "wifi";
    ms.recIp = getServerIp();
    ms.open = query.open;
    queryModule.insertMqttLog(ms)

    response.send(query);

})
app.get('/bleDisConnect', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    console.log("open ====>" + query.topic);
    client.publish(query.topic, JSON.stringify(mqttModule.bleDisConnect()), {qos:2})

    response.send(query);

})
app.get('/bleOpen', function(request, response) {
  
    var uri = request.url;
    var query = url.parse(uri, true).query;
    console.log("open ====>" + query.topic);
    client.publish(query.topic, JSON.stringify(mqttModule.bleOpen()), {qos:2})

    response.send(query);

})



server.listen(AppInfo.serverPort, function() {
    console.log('서버 실행 중..')
    // console.log(document);
})