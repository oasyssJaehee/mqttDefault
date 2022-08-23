const express = require('express')
var router = express.Router();
const fs = require('fs')
const url = require('url');

const mysql = require("./MySQL.js")


const multer = require('multer');
const path = require('path');
const { Console } = require('console');
const crypto = require('./crypto');
const AppInfo = require('./AppInfo');

// multer setting
const upload = multer({
  storage: multer.diskStorage({
    // set a localstorage destination
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    // convert a file name
    filename: (req, file, cb) => {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
});
router.use((req, res, next) => {
  // changing layout for my admin panel
  req.app.set('layout', 'ble/mobile/layout');
  next();
});
router.post('/', upload.single('img'));


router.get('/index', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");

  var pri_check = req.cookies["pri_check"];
  res.render("ble/mobile/index",{
    page:"index",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key,
    pri_check: pri_check
  })
});
router.get('/keySett', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/keySett",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })
});
router.get('/index1', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/index1",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })
});
router.get('/index2', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/index2",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })
});
router.get('/index3', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/index3",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })

  sendSms(query);

});
const iconv  = require('iconv-lite');
var jschardet   = require('jschardet');
const sendSms = function(data){
	var formData = {};
	formData = {
		'SENDPHONE':'070-8858-0840',
		'DESTPHONE':'01089097195',
		'STYPE':'1',
		'SUBJECT':'test',
		'MSG':'안녕하세요'
	}
	var stringData = "&SENDPHONE=070-8858-0840&DESTPHONE=01089097195&STYPE=1&SUBJECT=test&MSG=안녕하세요";
  
  // stringData = "";
  // stringData += "&SENDPHONE=";
  // stringData += iconv.encode("07088580840", 'iso-8859-1');
  // stringData += "&DESTPHONE=";
  // stringData += iconv.encode("01089097195", 'iso-8859-1');
  // stringData += "&STYPE=";
  // stringData += iconv.encode("1", 'iso-8859-1');
  // stringData += "&SUBJECT=";
  // stringData += iconv.encode("test", 'iso-8859-1');
  // stringData += "&MSG=";
  // stringData += iconv.encode("?��?��?��?��?��", 'iso-8859-1');

	// var buffer = iconv.encode(stringData, 'ksc5601');
  buffer = iconv.encode(stringData, 'iso-8859-1');
	var param = buffer.toString('binary');
  
  
  console.log(jschardet.detect(stringData));

	var api_url = 'http://blue3.eonmail.co.kr:8081/weom/servlet/api.EONASP6';
	var request = require('request');
	var options = {
		url: api_url,
		method:'POST',
		headers: {
			'eon_licencekey':"HEKaq1o47lgVravbPKRVSZvixUFderNeTv4EmpPMuqo="
		},
		form:stringData
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
router.get('/index4', function (req, res) {
  var uri = req.url;
  var query = url.parse(uri, true).query;
  var key = query.key;
  key = key.replace(/ /gi, "+");
  var dec = crypto.decipher(key, AppInfo.AES_KEY);
  var decArr = dec.split("/");
  res.render("ble/mobile/index4",{
    page:"keySett",
    hotelCode: decArr[0],
    rspk: decArr[1],
    acno : decArr[2],
    rono: decArr[3],
    key: query.key
  })
});
//mysql
const connection = mysql.connection()

router.get('/pri_cookie', function (req, res) {
  res.cookie("pri_check", "1", {
    maxAge: (1000*60*60*24) * 7
  });
  res.setHeader('Content-Type', 'application/json');
  res.send();
  res.end();
});
//?��체코?�� ?��?��
router.get('/mysql/co', function (req, res) {
  var uri = req.url;
var data = url.parse(uri, true).query;
var format = {language: 'sql', indent: '  '};
var xml_name = data.xml;
var query = mysql.coMapper().getStatement("co", xml_name, data, format);

  connection.query(query, function (err, rows, fields) {
    if(err){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(err));
        res.end();
    }else{
        res.setHeader('Content-Type', 'application/json');
        if(rows.length > 0){
          data.code = rows[0].BS_CODE;
          query = mysql.coMapper().getStatement("co", "bs_code_insert", data, format);
          connection.query(query, function (err, rows, fields) {
            if(err){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(err));
                res.end();
            }else{
                res.setHeader('Content-Type', 'application/json');
                if(rows.length > 0){
                  console.log(rows);
        
                  
                }
                var result = JSON.stringify(rows)
                
                res.send(result);
                res.end();
            }
          });
        }
    }
  });
});

router.get('/mysql/fo', function (req, res) {
  var uri = req.url;
var data = url.parse(uri, true).query;
var format = {language: 'sql', indent: '  '};
var xml_name = data.xml;
var query = mysql.foMapper().getStatement("fo", xml_name, data, format);

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
module.exports = router;