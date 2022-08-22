const { post } = require('request');

const serverPort = 6001;
const hotelCode = "20001";
const hotelName = "오아시스";

const saleType = "jebee";
const mqttUrl = "mqtt://210.114.18.107";
const logoName = "logo_jebee.png";
const AES_KEY = "ioptoprr89u34547yhdt";
const httpUrl = "http://bridge.oasyss.co.kr";

const sendSms = function(data){
	
	var api_url = 'http://blue3.eonmail.co.kr:8081/weom/servlet/api.EONASP6';
	var request = require('request');
	var options = {
		url: api_url,
		form: {'url':"test"},
		method:'POST',
		headers: {
			'eon_licencekey':"HEKaq1o47lgVravbPKRVSZvixUFderNeTv4EmpPMuqo="
		},
		body:{
			'SENDPHONE':'070-8858-0840',
			'DESTPHONE':'01089097195',
			'STYPE':'1',
			'SUBJECT':'test',
			'MSG':'하이'
		}
	};
	request.post(options, function (error, response, body) {
		var jsonBody = JSON.parse(body);
		
		if (!error && response.statusCode == 200) {
			console.log(body);
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