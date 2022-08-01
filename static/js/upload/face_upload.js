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
    if(file_ex.toLowerCase().indexOf("png") != "-1"
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
            {maxWidth: 600, orientation: 1 } // Options
            );
        });
    }else{
        Alert("이미지 파일만 사용 가능 합니다.");
    }
    $(".pie_progress").css("display","block");
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
            }
            setTimeout(function(){
                $('.pie_progress').css("display", "none");
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
    imgName = pname;
    imgPath = paddr;
    $(".revise_cont_user_img").css("background-image", "url("+imgPath+imgName+")");
    
}
