const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");
// 1. multer 미들웨어 등록

// 1. 미들웨어 등록
let storage = multer.diskStorage({
    destination: function(req, file ,callback){
        callback(null, "./upload/")
    },
    filename: function(req, file, callback){
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        callback(null, basename + "-" + Date.now() + extension);
    }
});

let upload = multer({
    storage: storage
});
// 뷰 페이지 경로
// router.get('/index', function(req, res, next) {
//     res.render("board")
// });

// 2. 파일 업로드 처리

 
var cpUpload = upload.fields([{ name: 'myFile', maxCount: 10 }])



router.post('/create', cpUpload, function(req, res, next) {
    // 3. 파일 객체
    console.log("파일 업로드 ===============>");
    var resultArr = new Array();
    let file = req.files
    var jsonStr = JSON.stringify(file);
    var jsonObj = JSON.parse(jsonStr);

    // for(var i=0; i<file.length; i++){
    //     console.log(file[i].originalname);
    //     var obj = new Object();
    //     obj.originalName = file[i].originalname;
    //     obj.size = file[i].size
    //     resultArr.push(obj);
    // }
    
    // console.log(resultArr);
    console.log(jsonObj.myFile);
    res.json(jsonObj.myFile);
});



module.exports = router;