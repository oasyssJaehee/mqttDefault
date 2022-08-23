const { post } = require('request');
const iconv  = require('iconv-lite');

const serverPort = 6001;
var hotelCode = "20001";
var hotelName = "오아시스";

var saleType = "jebee";
var mqttUrl = "mqtt://210.114.18.107";
var logoName = "logo_jebee.png";
var AES_KEY = "ioptoprr89u34547yhdt";
var httpUrl = "http://bridge.oasyss.co.kr";


const sendSms = function(data){
	var formData = {};
	formData = {
		'SENDPHONE':'070-8858-0840',
		'DESTPHONE':'01089097195',
		'STYPE':'1',
		'SUBJECT':'test',
		'MSG':'테스트입니다만?'
	}
	var stringData = "&SENDPHONE=070-8858-0840&DESTPHONE=01089097195&STYPE=1&SUBJECT=test&MSG=테스트입니다";
	var buffer = iconv.encode(stringData, 'EUC-KR'); // 파라미터를 euc-kr 로 인코딩 해 버퍼에 담은 후,
	var param = buffer.toString('binary'); // 바이너리로 변환해 이스케이프하면 된다.


	var api_url = 'http://blue3.eonmail.co.kr:8081/weom/servlet/api.EONASP6';
	var request = require('request');
	var options = {
		url: api_url,
		method:'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'eon_licencekey':"HEKaq1o47lgVravbPKRVSZvixUFderNeTv4EmpPMuqo="
		},
		form:param,
		qsStringifyOptions: {
			encoding: false
		 } 
		// body: param
	};
	request.post(options, function (error, response, body) {
		console.log(response.statusCode);
		if (!error && response.statusCode == 200) {
			console.log(body);
			let utf8Str = iconv.decode(body, 'euc-kr');
			console.log(utf8Str);
		} else {
			console.log('error = ' + response.statusCode);
		}
	});
} 

module.exports = {
    serverPort,
    hotelCode,
	hotelName,
	saleType,
	mqttUrl,
	logoName,
	AES_KEY,
	httpUrl
}
module.exports.sendSms = sendSms