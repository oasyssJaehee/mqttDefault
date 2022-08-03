const express = require('express')
var router = express.Router();
const fs = require('fs')
const url = require('url');


//켜지고
const relayOn = function(){
    var data = new Uint8Array(10); 
    data[0] = 221;
    data[1] = 2;
    data[2] = 1;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = 0;
    data[7] = 0;
    data[8] = 0;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
//꺼지고
const relayOff = function(){
    var data = new Uint8Array(10); 
    data[0] = 221;
    data[1] = 2;
    data[2] = 0;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = 0;
    data[7] = 0;
    data[8] = 0;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
//접점모드(켜지고 꺼지고)
const relayContact = function(){
    var data = new Uint8Array(10); 
    data[0] = 221;
    data[1] = 2;
    data[2] = 2;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = 0;
    data[7] = 0;
    data[8] = 0;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const relayCheck = function(){
    var data = new Uint8Array(10); 
    data[0] = 221;
    data[1] = 1;
    data[2] = 0;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = 0;
    data[7] = 0;
    data[8] = 0;
    data[9] = 0;

    data = checkSum(data);

    return data;
}

const bleConnect = function(){
    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    year = String(year).substr(2,4);

    var data = new Uint8Array(10); 
    data[0] = 210;
    data[1] = 1;
    data[2] = 1;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = 0;
    data[7] = 0;
    data[8] = 0;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const bleOpen = function(){
    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    year = String(year).substr(2,4);

    var data = new Uint8Array(10); 
    data[0] = 210;
    data[1] = 2;
    data[2] = 0;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = 0;
    data[7] = 0;
    data[8] = 0;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const bleDisConnect = function(){
    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    year = String(year).substr(2,4);

    var data = new Uint8Array(10); 
    data[0] = 210;
    data[1] = 1;
    data[2] = 2;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = 0;
    data[7] = 0;
    data[8] = 0;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const bleTest = function(){
    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    year = String(year).substr(2,4);

    var data = new Uint8Array(10); 
    data[0] = 210;
    data[1] = 0;
    data[2] = 0;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = 0;
    data[7] = 0;
    data[8] = 0;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const doorOpen = function(){
    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    year = String(year).substr(2,4);

    var data = new Uint8Array(10); 
    data[0] = 204;
    data[1] = 1;
    data[2] = 0;
    data[3] = 0;
    data[4] = 0;
    data[5] = 0;
    data[6] = 0;
    data[7] = 0;
    data[8] = 0;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const doorPass = function(pass1,pass2,pass3,pass4){

    var data = new Uint8Array(10); 
    data[0] = 204;
    data[1] = 15;
    data[2] = 0;
    data[3] = 0;
    data[4] = 0;
    data[5] = pass1;
    data[6] = pass2;
    data[7] = pass3;
    data[8] = pass4;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const doorPassMaster = function(pass1,pass2,pass3,pass4){

    var data = new Uint8Array(10); 
    data[0] = 204;
    data[1] = 23;
    data[2] = 0;
    data[3] = 0;
    data[4] = 0;
    data[5] = pass1;
    data[6] = pass2;
    data[7] = pass3;
    data[8] = pass4;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const doorPassMaid = function(pass1,pass2,pass3,pass4){

    var data = new Uint8Array(10); 
    data[0] = 204;
    data[1] = 24;
    data[2] = 0;
    data[3] = 0;
    data[4] = 0;
    data[5] = pass1;
    data[6] = pass2;
    data[7] = pass3;
    data[8] = pass4;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const doorPassVerify = function(user,pass1,pass2,pass3,pass4){

    var data = new Uint8Array(10); 
    data[0] = 204;
    data[1] = 25;
    data[2] = 0;
    data[3] = user;
    data[4] = 0;
    data[5] = pass1;
    data[6] = pass2;
    data[7] = pass3;
    data[8] = pass4;
    data[9] = 0;

    data = checkSum(data);

    return data;
}
const doorPassTime = function(year, month, date, hours, min){

    var data = new Uint8Array(10);
    data[0] = 204;
    data[1] = 12;
    data[2] = 0;
    data[3] = 0;
    data[4] = year;
    data[5] = month;
    data[6] = date;
    data[7] = hours;
    data[8] = min;
    data[9] = 0;

    
    data = checkSum(data);

    return data;
}
const doorTime = function(){
    let today = new Date();   

    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    year = String(year).substr(2,4);

    var data = new Uint8Array(10);
    data[0] = 204;
    data[1] = 5;
    data[2] = 0;
    data[3] = 0;
    data[4] = year;
    data[5] = month;
    data[6] = date;
    data[7] = hours;
    data[8] = minutes;
    data[9] = 0;

    
    data = checkSum(data);

    return data;
}
function checkSum(data){
    var check = 0;
    for (var j = 0; j < 9; j++) {
        check += data[j];
    }
    var result = check % 256;
    data[9] = result;

    return data;
}
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
//16진수 -> 10진수
function hexDec(hex){
    return parseInt(hex, 16);
}
module.exports.relayOn = relayOn;
module.exports.relayOff = relayOff;
module.exports.relayContact = relayContact;
module.exports.relayCheck = relayCheck;
module.exports.doorTime = doorTime;
module.exports.doorOpen = doorOpen;
module.exports.bleConnect = bleConnect;
module.exports.bleDisConnect = bleDisConnect;
module.exports.bleTest = bleTest;
module.exports.bleOpen = bleOpen;