var filesTempArr = [];
var readerArr = [];
var imgAddCount = 0;


function addFiles(e, input) {
    var files = e.target.files;
    
    var filesArr = Array.prototype.slice.call(files);
    var filesArrLen = filesArr.length;
    var filesTempArrLen = filesTempArr.length;
    var reader = new FileReader();
    // onclick=\"deleteFile(event, " + i + ");
    var maxSize  = 60 * 1024 * 1024;
    var fileSize = files[0].size;

    if(fileSize >= maxSize){
        alert("파일 용량은 60MB아래로 올려주세요.\n올리신 파일 용량은 ["+Math.floor(fileSize/1024/1024)+"MB]입니다.");
        filesTempArr = [];
        imgAddCount = 0;
        $("input[name='addFile']").val("");
        return;
    }
    var file_ex = String(files[0].name.split(".")[1]);
    if(file_ex.toLowerCase() == "mp4" 
        || file_ex.toLowerCase() == "avi" 
        || file_ex.toLowerCase() == "mkv" 
        || file_ex.toLowerCase() == "mov"){
        filesArr.forEach(function(f){
            filesTempArr.push(f);
            imgSend();
        });
    }else if(file_ex.toLowerCase().indexOf("png") != "-1"
            || file_ex.toLowerCase().indexOf("jpg") != "-1"
            || file_ex.toLowerCase().indexOf("jpeg") != "-1"){
        //이미지 미리보기
        filesArr.forEach(function(f){
            var originalName = f.name;
            loadImage(
                f,
                function (img) {
                   
                    if (img.type === "error") {
                        reject(img)
                    }
                    var reader = new FileReader();
                    
                    if(isImageResizable()){
                        // Resize the image
                        var canvas = document.createElement('canvas'),
                        max_size = 760,
                        width = img.width,
                        height = img.height;
        
                        if (width > height) {
                            if (width > max_size) {
                                height *= max_size / width;
                                width = max_size;
                            }
                        } else {
                            if (height > max_size) {
                                width *= max_size / height;
                                height = max_size;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                        var dataUrl = canvas.toDataURL('image/png');
                        //var dataUrl = canvas.toDataURL('image/jpeg', 0.90);   // 이미지 퀄리티 조절도 가능...
                        var resizedImage = dataURLToBlob(dataUrl);
                        filesTempArr.push(resizedImage);
                        reader.onload = function(e){
                            
                            imgSend(originalName);
                            imgAddCount++;
                        }
                        reader.readAsDataURL(resizedImage);
                    }else{
                        
                        filesTempArr.push(f);
                        reader.onload = function(e){
                            
                            imgSend(originalName);
                            imgAddCount++;
                        }
                        reader.readAsDataURL(f);
                    }
                    
                }
            ,
            {maxWidth: 600, orientation: true } // Options
            );
        });
    }else{
        filesArr.forEach(function(f){
            filesTempArr.push(f);
            imgSend();
        });
    }
    $(".pie_progress_wrap").css("display","block");
}
function isImageResizable() {
    var isCanvasUsable = !!document.createElement('canvas').getContext;
    var isLowerIE = false;
 
    if($.browser.msie) {
        if($.browser.version < 10) {    // IE9은 Canvas는 쓸 수 있지만 file input에서 file Object를 가져오지 못해 제외
            isLowerIE = true;
        }
    }
 
    return isCanvasUsable && !isLowerIE;
}
var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];
        return new Blob([raw], {type: contentType});
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: contentType});
}

//이미지전송
function imgSend(originalName){
    var formData = new FormData();

    // 파일 데이터
    for(var i=0, filesTempArrLen = filesTempArr.length; i<filesTempArrLen; i++) {
       formData.append("myFile", filesTempArr[i], originalName);
    }
    
    
    
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/upload/create",
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            xhr.upload.onprogress = function(e) {
                var percent = e.loaded * 100 / e.total;
                // $(".progress-bar").css("width", percent+"%");
                $('.pie_progress').asPieProgress('go',percent);
                if(percent == 100){
                    console.log(percent);
                    // $(".progress-bar").css("width", "0%");
                    
                }
                // $selfProgress.val(percent); //개별 파일의 프로그레스바 진행
            };
            return xhr;
        },
        success: function (data) {
            // console.log("2");
            
            for(var i=0; i < data.length; i++){
                var imgname = data[i]['filename'];
                var path = data[i]['path'];
                var imgItem = "";
                path = path.replace(/\\/gi, "/"); 
                db_save("/file/", imgname);
                // user = "";
                // if(admin_id == ""){
                //     user = "replies";
                // }else{
                //     user = "sent";
                // }
                // var img_src = "";
                // if(USER_IMGNAME == ""){
                //     if(admin_id == ""){
                //         img_src = "";
                //     }else{
                //         img_src = "<img src='/img/logo_icon.png' alt=''></img>";
                //     }
                // }else{
                //     img_src = "<img src='"+hompageUrl+"/file/image.do?path="+USER_IMGADDR+"&name="+USER_IMGNAME+"' alt=''></img>";
                // }
                // if(imgname.toLowerCase().indexOf(".png") != "-1"
                //     || imgname.toLowerCase().indexOf(".jpg") != "-1"
                //     || imgname.toLowerCase().indexOf(".jpeg") != "-1"){
                //     imgItem += "<li class='"+user+"'>";
                //     imgItem += img_src;
                //     imgItem += "<div>";
                //     imgItem += "<p style='width:240px; height:240px; padding:7px 8px; background: rgba(000,000,000,0.1);'>";
                //     imgItem += "<a href='/file/"+imgname+"' target='_blank'>";
                //     imgItem += "<img style='margin:0;width:100%; height:100%; border-radius:20px !important;' src='/file/"+imgname+"' class='rounded float-left' alt=''></img>"
                //     imgItem += "</a>";
                //     imgItem += "</p>";
                //     imgItem += "<span class='date_span'>"+toTime()+"</span>";
                //     imgItem += "</div>";
                //     // imgItem += "<img id='imgItem"+imgAddCount+"' class='view_img pMenu' src='"+e.target.result+"'><span class='close_span pMenu'><i class='fas fa-times pMenu'></i></span>";
                //     imgItem += "</li>";
                // }else if(imgname.toLowerCase().indexOf(".mp4") != "-1"
                // || imgname.toLowerCase().indexOf(".avi") != "-1"
                // || imgname.toLowerCase().indexOf(".mkv") != "-1"
                // || imgname.toLowerCase().indexOf(".mov") != "-1"){
                //     imgItem += "<li class='"+user+"'>";
                //     imgItem += img_src;
                //     imgItem += "<div>";
                //     imgItem += "<p style='padding:7px 8px; background: rgba(000,000,000,0.1);'>";
                //     // imgItem += "<div class='embed-responsive embed-responsive-16by9'>";
                //     imgItem += "<video style='width:100%; border-radius:20px;' width='245' height='190' controls><source src='/file/"+imgname+"' type='video/mp4'></video>";
                //     // imgItem += "</div>";
                //     imgItem += "</p>";
                //     imgItem += "<span class='date_span'>"+toTime()+"</span>";
                //     imgItem += "</div>";
                //     // imgItem += "<img id='imgItem"+imgAddCount+"' class='view_img pMenu' src='"+e.target.result+"'><span class='close_span pMenu'><i class='fas fa-times pMenu'></i></span>";
                //     imgItem += "</li>";  
                // }else{
                //     imgItem += "<li class='"+user+"'>";
                //     imgItem += img_src;
                //     imgItem += "<div>";
                //     imgItem += "<p style='padding:0; background: rgba(000,000,000,0);'>";
                //     // imgItem += "<div class='embed-responsive embed-responsive-16by9'>";
                //     var sub_name = imgname.split(".");
                //     var sub_name1 = sub_name[0];
                //     var sub_name2 = sub_name[1];
                //     if(sub_name1.length > 5){
                //         if(typeof sub_name2 == "undefined"){
                //             sub_name1 = "확인되지않은 확장자";
                //         }else{
                //             sub_name1 = sub_name1.substr(0,5)+"···." + sub_name2;
                //         }
                //     }
                //     imgItem += "<button class='down_btn'><a href='/file/"+imgname+"'><i class='fa fa-download'></i> "+sub_name1+"</a></button>";
                //     // imgItem += "</div>";
                //     imgItem += "</p>";
                //     imgItem += "<span class='date_span'>"+toTime()+"</span>";
                //     imgItem += "</div>";
                //     // imgItem += "<img id='imgItem"+imgAddCount+"' class='view_img pMenu' src='"+e.target.result+"'><span class='close_span pMenu'><i class='fas fa-times pMenu'></i></span>";
                //     imgItem += "</li>";  
                // }
                // socket.emit("sendChat", {msg : imgItem, chat_key: chat_key, admin_id : admin_id, rm : rm, auto : "1", type: "file"});
                
            }
            setTimeout(function(){
                $('.pie_progress_wrap').css("display", "none");
            }, 500);
        },
        error: function (e) {
            console.log("ERROR : ", e);
            // $("#btnSubmit").prop("disabled", false);
            alert("fail");
        }
    });
    filesTempArr = [];
    imgAddCount = 0;
}
function db_save(paddr, pname){
    $.ajax({
        url : "/mysql/insertChat",
        data: {
            xml:"chat_sub_insert",
            mainKey: mainKey,
            msg: '',
            imgName: pname,
            imgPath: paddr,
            view: '0',
            userId: userId,
            admin: adminTF
        }, success: function(re){
            if(re){
                var date = re[0].DATE;
                imgName = pname;
                imgPath = paddr;
                sendMsg('',date);
            }else{
                Alert("메세지 전송 실패");
            }
        }
    });
}
