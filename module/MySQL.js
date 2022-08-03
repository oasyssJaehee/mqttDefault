const express = require('express')
var router = express.Router();
const fs = require('fs')
const url = require('url');

var mysql_dbc = require('../db/db_con')();

var connection = mysql_dbc.init();

mysql_dbc.open(connection);

const userMapper = require('mybatis-mapper');
userMapper.createMapper(['./db/xml/user.xml']);
const mqttMapper = require('mybatis-mapper');
mqttMapper.createMapper(['./db/xml/mqtt.xml']);
const chatMapper = require('mybatis-mapper');
chatMapper.createMapper(['./db/xml/chat.xml']);
const commonMapper = require('mybatis-mapper');
commonMapper.createMapper(['./db/xml/common.xml']);
const roomMapper = require('mybatis-mapper');
roomMapper.createMapper(['./db/xml/room.xml']);
const coMapper = require('mybatis-mapper');
coMapper.createMapper(['./db/xml/co.xml']);

function useMysql(req, res, mapper){
    var result;

    var uri = req.url;
    var data = url.parse(uri, true).query;
    var format = {language: 'sql', indent: '  '};
    var xml_name = data.xml;
    console.log(xml_name);
    console.log(data);
    var query = userMapper.getStatement("user", xml_name, data, format);
    connection.query(query, function (err, rows, fields) {
        if(err){
            result = JSON.stringify(err);
            console.log(err);
            return result
        }else{
            console.log(rows);
            res.setHeader('Content-Type', 'application/json');
            result = JSON.stringify(rows)
            return result
        }
    });
}
var returnConnection = function(){
    return connection
}
var returnUserMapper = function(){
    return userMapper
}
var returnMqttMapper = function(){
    return mqttMapper
}
var returnChatMapper = function(){
    return chatMapper
}
var returnCommonMapper = function(){
    return commonMapper
}
var returnRoomMapper = function(){
    return roomMapper
}
var returnCoMapper = function(){
    return coMapper
}

module.exports.connection = returnConnection
module.exports.userMapper = returnUserMapper
module.exports.mqttMapper = returnMqttMapper
module.exports.commonMapper = returnCommonMapper
module.exports.chatMapper = returnChatMapper
module.exports.coMapper = returnCoMapper