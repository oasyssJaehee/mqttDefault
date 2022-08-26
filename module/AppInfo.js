const { post } = require('request');
const iconv  = require('iconv-lite');

const serverPort = 6001;

var saleType = "jebee";
var mqttUrl = "mqtt://210.114.18.107";
var AES_KEY = "ioptoprr89u34547yhdt";
var httpUrl = "http://182.215.211.211:6001";

const mysql = require("./MySQL.js");
const connection = mysql.connection();







function smsDateFormat(date){
	var dateStr = "";
	dateStr += date.substring(0,4);
	dateStr += ".";
	dateStr += date.substring(4,6);
	dateStr += ".";
	dateStr += date.substring(6,8);
	dateStr += " ";
	dateStr += date.substring(8,10);
	dateStr += ":";
	dateStr += date.substring(10,12);

	return dateStr;
}
const sendSms = function(data, smsType){
	var formData = {};
	console.log(data);
	var msg = "";
	var title = "";
	if(smsType == 1){
		data.stype = 4;
		title = "["+data.BS_NAME+" 폰키 발급 안내]"; 
		msg += "["+data.BS_NAME+" 폰키 발급 안내]";
		msg += "\t\n";
		msg += "*객실번호:"+data.rono;
		msg += "\t\n*사용기한:";
		msg += "\t\n";
		msg += smsDateFormat(data.idate) +"~"+ smsDateFormat(data.odate);
		msg += "\t\n";
		msg += "\t\n";
		msg += "[URL]\t\n";
		msg += data.url;
	}else if(smsType == 2){
		data.stype = 4;
		title = "["+data.BS_NAME+" 폰키 변경 안내]"; 
		msg += "["+data.BS_NAME+" 폰키 변경 안내]";
		msg += "\t\n";
		msg += "*객실번호:"+data.rono;
		msg += "\t\n*사용기한:";
		msg += "\t\n";
		msg += smsDateFormat(data.idate) +"~"+ smsDateFormat(data.odate);
		msg += "\t\n";
		msg += "\t\n";
		msg += "[URL]\t\n";
		msg += data.url;
	}else if(smsType == 3){
		data.stype = 1;
		title = "["+data.BS_NAME+" 폰키 취소 안내]"; 
		msg += "["+data.BS_NAME+" 폰키 취소 안내]";
		msg += "\t\n";
		msg += "*객실번호:"+data.rono;
		msg += "\t\n\t\n폰키가 취소 되었습니다.";
	}
	data.title = title;
	data.msg = msg;

	formData = {
		'SENDPHONE':data.sendTel,
		'DESTPHONE':data.phone,
		'STYPE':data.stype,
		'SUBJECT':title,
		'MSG':msg
	}

	var api_url = 'http://blue3.eonmail.co.kr:8081/weom/servlet/api.EONASP6P';
	var request = require('request');
	var options = {
		url: api_url,
		method:'POST',
		headers: {
			'eon_licencekey':"HEKaq1o47lgVravbPKRVSZvixUFderNeTv4EmpPMuqo="
		},
		form:formData
		// body: param
	};
	request.post(options, function (error, response, body) {
		console.log(response.statusCode);
		if (!error && response.statusCode == 200) {
			console.log(body);
			var res = JSON.parse(body);
			data.AES_KEY = AES_KEY;
			data.cpid = res.CPID;
			data.resCode = res.RESULTCODE;
			data.temp = "EONASP";

			var format = {language: 'sql', indent: '  '};
			
			var query = mysql.coMapper().getStatement("co", "sms_log_insert", data, format);
			connection.query(query, function (err, rows, fields) {
				if(err){
					console.log(err);
				}else{
				}
			});
		} else {
			console.log('error = ' + response.statusCode);
		}
	});
} 

module.exports = {
    serverPort,
	saleType,
	mqttUrl,
	AES_KEY,
	httpUrl
}
module.exports.sendSms = sendSms