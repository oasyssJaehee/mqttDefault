function chatBot(res, bot, type){
    var chat = "";
    if(type == "list"){
        
        var title = "";
        title = bot.CODE_CONTENT;
        
        title = replaceAll(title, "[content]", bot.userName);
        title = replaceAll(title, "&#10;", "<br>");
        
        chat += "<div class='chat_send_box chat_send_left'>"
                + "<div class='chat_send_cont chat_send_profile'></div>"
                + "<div class='chat_send_cont chat_send_text'>"
                + "<p class='name_txt admin_name'>챗봇</p>"
                + "<div id='ctgListDiv' class='chat_send_div'>"
                + "<p class='chat_send_txt'>"+title+"</p>"
                + "<ul class='chat_send_listbox'>";
        for(var i=0; i<res.length; i++){
            chat += "<li class='chat_send_list' data-code='"+res[i].CODE_CODE+"'>"
                    + res[i].CODE_CONTENT
                    +	"</li>";
        }
        chat += "</ul>"
                + "</div>"
                + "</div>"
                + "</div>";
    }else if(type == "listSelect"){
        var codeMsg = "";
        codeMsg = bot.CODE_CONTENT;
        codeMsg = replaceAll(codeMsg, "[content]", "["+res.CODE_CONTENT+"]");
        codeMsg = replaceAll(codeMsg, "&#10;", "<br>");

        chat += "<div class='chat_send_box chat_send_left'>"
            + "<div class='chat_send_cont chat_send_profile'></div>"
            + "<div class='chat_send_cont chat_send_text'>"
            + "<p class='name_txt admin_name'>챗봇</p>"
            + "<div id='ctgListDiv' class='chat_send_div'>"
            + "<p class='chat_send_txt'>"+codeMsg+"</p>"
            + "</div>"
            + "</div>"
            + "</div>"
            + "</div>";
    }
    

    return chat;
}
function chatInit(data){
    var chat = "";
    var nextI = 0;
    for(var i=0; i<data.length; i++){
        //날짜 다를때 날짜넣기
        nextI = i+1;
        var dateBox = "";
        if(nextI == data.length){
            nextI = data.length - 1;
        }
        if(data[i].CHAT_DATE != data[nextI].CHAT_DATE){
            dateBox += "<div>"
                    + "<span class='dateBox'>"
                    + data[i].CHAT_DATE
                    + "</span>"
                    + "</div>";
        }else{
            dateBox = "";
        }
        var msg = data[i].CHAT_SUB_CONTENT;
        var sendDiv = "";
        if(data[i].CHAT_SUB_IMG_NAME == ''){
            sendDiv = "<p class='chat_send_txt'>"+msg+"</p>";
        }else{
            sendDiv += fileCheck(data[i].CHAT_SUB_IMG_PATH,data[i].CHAT_SUB_IMG_NAME);
        }
        var img = data[i].ADMIN_IMGNAME;
        if(img != null && img != ""){
            var path = data[i].ADMIN_IMGPATH;
            var imgname = data[i].ADMIN_IMGNAME;

            adminUserImg = data[i].ADMIN_IMGPATH+data[i].ADMIN_IMGNAME;

            img = "style='background-image: url("+path+imgname+");'";
        }else{
            img = "";
            adminUserImg = "";
        }
        if(data[i].CHAT_SUB_ADMIN == "0"){
            chat += "<div class='chat_send_box chat_send_right'>"
                + "<div class='chat_send_cont chat_send_text'>"
                + "<div class='chat_send_div'>"
                + sendDiv
                + "</div>"
                + "</div>"
                + "<div class='chat_send_cont chat_send_time'>"
                + "<p class='chat_send_time_txt'>"+data[i].CHAT_SUB_DATE+"</p>"
                + "</div>"
                + "</div>";
        }else{
            chat += "<div class='chat_send_box chat_send_left'>"
                + "<div class='chat_send_cont chat_send_profile' "+img+"></div>"
                + "<div class='chat_send_cont chat_send_text'>"
                + "<p class='name_txt admin_name'>"+data[i].ADMIN_NAME+"</p>"
                + "<div class='chat_send_div'>"
                + sendDiv
                + "</div>"
                + "</div>"
                + "<div class='chat_send_cont chat_send_time'>"
                + "<p class='chat_send_time_txt'>"+data[i].CHAT_SUB_DATE+"</p>"
                + "</div>"
                + "</div>";
        }
        chat += dateBox;
    }
    
    return chat;
}
function chatRecev(data){
    var item = "";
    var sendDiv = "";
    if(data.imgName == ''){
        sendDiv = "<p class='chat_send_txt'>"+data.msg+"</p>";
    }else{
        sendDiv += fileCheck(data.imgPath,data.imgName);
    }
    var img = "";
    if(adminUserImg != ""){


        img = "style='background-image: url("+adminUserImg+");'";
    }else{
        img = "";
        adminUserImg = "";
    }
    if(data.admin == "0"){
        item += "<div class='chat_send_box chat_send_right'>"
            + "<div class='chat_send_cont chat_send_text'>"
            + "<div class='chat_send_div'>"
            + sendDiv
            + "</div>"
            + "</div>"
            + "<div class='chat_send_cont chat_send_time'>"
            + "<p class='chat_send_time_txt'>"+data.date+"</p>"
            + "</div>"
            + "</div>";
    }else{
        item += "<div class='chat_send_box chat_send_left'>"
            + "<div class='chat_send_cont chat_send_profile' "+img+"></div>"
            + "<div class='chat_send_cont chat_send_text'>"
            + "<p class='name_txt admin_name'>"+data.userName+"</p>"
            + "<div class='chat_send_div'>"
            + sendDiv
            + "</div>"
            + "</div>"
            + "<div class='chat_send_cont chat_send_time'>"
            + "<p class='chat_send_time_txt'>"+data.date+"</p>"
            + "</div>"
            + "</div>";
    }
    return item;
}
function updateView(data){
    $.ajax({
        url:"/mysql/chat",
        data:{
            xml:"update_sub_view_user",
            userId: data.userId,
            mainKey: data.key
        }, success:function(res){

        }
    });
}

function fileCheck(path, imgname){
    var imgItem = "";
    if(imgname.toLowerCase().indexOf(".png") != "-1"
                    || imgname.toLowerCase().indexOf(".jpg") != "-1"
                    || imgname.toLowerCase().indexOf(".jpeg") != "-1"){
                        imgItem += "<a class='image-popup-no-margins' href='"+path+imgname+"'>";
                        imgItem += "<img class='popup-link' style='margin:0;width:100%; height:100%; border-radius:20px !important;' src='"+path+imgname+"' class='rounded float-left' alt=''></img>";
                        imgItem += "</a>";
    }else if(imgname.toLowerCase().indexOf(".mp4") != "-1"
    || imgname.toLowerCase().indexOf(".avi") != "-1"
    || imgname.toLowerCase().indexOf(".mkv") != "-1"
    || imgname.toLowerCase().indexOf(".mov") != "-1"){
        imgItem += "<video style='width:100%; border-radius:20px;' width='245' height='190' controls><source src='"+path+imgname+"' type='video/mp4'></video>";
    }else{
        var sub_name = imgname.split(".");
        var sub_name1 = sub_name[0];
        var sub_name2 = sub_name[1];
        if(sub_name1.length > 5){
            if(typeof sub_name2 == "undefined"){
                sub_name1 = "확인되지않은 확장자";
            }else{
                sub_name1 = sub_name1.substr(0,5)+"···." + sub_name2;
            }
        }
        
        imgItem += "<button class='down_btn'><a href='"+path+imgname+"'><i class='fa fa-download'></i> "+sub_name1+"</a></button>";
    }
    return imgItem;
}
function scrollBottom(el){
    setTimeout(function(){
        $('html').animate({scrollTop : el.scrollHeight}, 400);
    }, 100);
    
}