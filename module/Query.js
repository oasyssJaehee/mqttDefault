const express = require('express')
var router = express.Router();
const fs = require('fs')
const url = require('url');

const mysql = require("./MySQL.js")
const connection = mysql.connection()
let format = {language: 'sql', indent: '  '};

var insertId = undefined;
var actionKey = undefined;

function insertMqttLog(jsonData){
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
    
    var query = mysql.mqttMapper().getStatement("mqtt", "mqtt_log_insert", data, format);
    
    connection.query(query, function (err, rows, fields) {
        if(err){
            console.log(err)
        }else{
            if((data.cmd != "1" && data.cmd != "255") && (data.type != "rec" || data.type != "auto")){
                data.insertId = rows.insertId;
                //릴레이 On
                if(
                    (data.cmd == "204" ||  data.cmd == "210")
                    && data.type != "rec"){
                    insertAction(data);
                }else if((data.cmd == "204"
                || data.cmd == "129"
                || data.cmd == "5"
                || data.cmd == "12"
                || data.cmd == "15"
                || data.cmd == "23"
                || data.cmd == "24") && data.type == "rec"){
                    updateAction(actionKey);
                }else if((data.cmd == "210") && data.type == "rec" && data.state != "2"){
                    updateAction(actionKey);
                }
                // updateCmdLog(insertId);
            }else{
                insertId = undefined;
            }
        }
    })
}
function insertAction(data){
    var query = mysql.mqttMapper().getStatement("mqtt", "mqtt_action_insert", data, format);
    
    connection.query(query, function (err, rows, fields) {
        if(err){
            console.log(err);
        }else{
            actionKey = rows.insertId;
        }
    })
}
function updateAction(id){
    data = {insertId:id};
    var query = mysql.mqttMapper().getStatement("mqtt", "mqtt_action_update", data, format);
    
    connection.query(query, function (err, rows, fields) {
        if(err){
            console.log(err)
        }else{
            actionKey = undefined;
        }
    })
}

module.exports.insertMqttLog = insertMqttLog;