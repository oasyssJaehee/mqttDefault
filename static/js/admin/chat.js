
function mainList(data){
    var item="";
    if(data.length > 0){
        for(var i=0; i<data.length; i++){

            var msg = data[i].CHAT_SUB_CONTENT;
            var img = data[i].USER_IMGNAME;
            var name = data[i].USER_NAME;
            var date = data[i].CHAT_SUB_DATE;
            if(msg == ""){
                msg = fileCheck_main(img);
            }
            var count = "<em class='user_contbox_talk'>"+data[i].COUNT+"</em>";
            if(data[i].COUNT == "0"){
                count = "";
            }
            if(img != ""){
                var path = data[i].USER_IMGPATH;
                var imgname = data[i].USER_IMGNAME;
                img = "style='background-image: url("+path+imgname+");'";
            }
            var infoP = "";
            var ddem = "";
            if(level == "0010000" || level == "0010001"){
                ddem = "<em class='info_p_em013'>담당자:"+data[i].ADMIN_NAME+"</em>";
            }
            infoP += "<p class='info_p'>"
                   + "<em class='info_p_em01'>"+data[i].ADDR1+"</em> "
                   + "<em class='info_p_em02'>"+data[i].ADDR2+"호</em> "
                   + ddem
                   + "</p>";
            
            item += "<li class='list_li' data-key='"+data[i].CHAT_MAIN_KEY+"' data-status='"+data[i].CHAT_MAIN_STATUS+"'>"
                  + "<div class='list_li_div dis_flex_row'>"
                  + "<div class='user_contbox user_contbox01'>"
                  + "<span class='profile_img' "+img+"></span>"
                  + "</div>"
                  + "<div class='user_contbox user_contbox02'>"
                  + infoP
                  + "<h2 class='user_contbox_tit'>"+name+"</h2>"
                  + "<p class='user_contbox_txt'>"+msg+"</p>"
                  +" </div>"
                  + "<div class='user_contbox user_contbox03'>"
                  + "<p class='user_contbox_time'>"+date+"</p>"
                  + count
                  + "</div>"
                  + "</div>"
                  + "</li>";
        }
        $(".wait_list_ulbox").css("display", "none");
    }else{
        $(".wait_list_ulbox").css("display", "flex");
    }
    
    return item;
}
function chatStatusChange(code){
    var title = "";
    if(code == "0050002"){
        title = "접수";
    }else if(code == "0050003"){
        title = "완료";
    }else if(code == "0050004"){
        title = "보류";
    }
    var botData;
    for(var i=0;i<chatBotList.length; i++){
        if(chatBotList[i].CODE_CODE == "0060003"){
            botData = chatBotList[i];
        }
    }
    $.ajax({
        url: "/mysql/chat",
        data: {
            xml: "chat_main_status_update",
            status: code,
            userId: userId,
            mainKey: mainKey
        }, success: function(){
            msg = botData.CODE_CONTENT;
            msg = replaceAll(msg, "[content]", title);
            $.ajax({
                url : "/mysql/insertChat",
                data: {
                    xml:"chat_sub_insert",
                    mainKey: mainKey,
                    msg: msg,
                    imgName: '',
                    imgPath: '',
                    view: '0',
                    userId: userId,
                    admin: "1"
                }, success: function(re){
                    
                    if(re){
                        
                        var date = re[0].DATE;
                        sendMsg(msg, date);
                        $("input[name='msgInput'").val("");

                        mainStatus = code;

                        $.ajax({
                            url:"/mysql/chat",
                            data :{
                                xml: "chat_status_ing"
                            }, success:function(ch){
                                chatIng(ch);
                            }
                        });
                    }else{
                        Alert("메세지 전송 실패");
                    }
                }
            });
        }
    });
}
function chatRecev(data){
    var item = "";
    var sendDiv = "";
    if(data.imgName == ''){
        sendDiv = "<p class='chat_send_txt'>"+data.msg+"</p>";
    }else{
        sendDiv += fileCheck(data.imgPath,data.imgName);
    }
    var userImg = "";
    if(selectUserImg != ""){
        userImg = "<img style='margin:0;width:100%; height:100%; border-radius:20px !important;' src='"+selectUserPath+selectUserImg+"' class='rounded float-left' alt=''></img>";
    }
    if(data.admin == "0"){
        item += "<div class='chat_send_box chat_send_left margin_top_20'>"
              + "<div class='chat_send_cont chat_send_profile'>"+userImg+"</div>"
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
        item += "<div class='chat_send_box chat_send_right'>"
                + "<div class='chat_send_cont chat_send_profile'></div>"
                + "<div class='chat_send_cont chat_send_text'>"
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
function subList(data){
    var item = "";
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
        var admin = data[i].CHAT_SUB_ADMIN;
        var msg = data[i].CHAT_SUB_CONTENT;
        var img = data[i].USER_IMGNAME;
        var sendDiv = "";
        if(data[i].CHAT_SUB_IMG_NAME == ''){
            sendDiv = "<p class='chat_send_txt'>"+msg+"</p>";
        }else{
            sendDiv += fileCheck(data[i].CHAT_SUB_IMG_PATH,data[i].CHAT_SUB_IMG_NAME);
        }
        if(img != null && img != ""){
            var path = data[i].USER_IMGPATH;
            var imgname = data[i].USER_IMGNAME;
            img = "style='background-image: url("+path+imgname+");'";
        }else{
            img = "";
        }
        
        if(admin == "0"){
            item += "<div class='chat_send_box chat_send_left margin_top_20'>"
                  + "<div class='chat_send_cont chat_send_profile' "+img+"></div>"
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
            item += "<div class='chat_send_box chat_send_right'>"
                    + "<div class='chat_send_cont chat_send_profile'></div>"
                    + "<div class='chat_send_cont chat_send_text'>"
                    + "<div class='chat_send_div'>"
                    + sendDiv
                    + "</div>"
                    + "</div>"
                    + "<div class='chat_send_cont chat_send_time'>"
                    + "<p class='chat_send_time_txt'>"+data[i].CHAT_SUB_DATE+"</p>"
                    + "</div>"
                    + "</div>";
        }
        item += dateBox;
    }

    return item;
}
function updateView(data){
    $.ajax({
        url:"/mysql/chat",
        data:{
            xml:"update_sub_view_admin",
            userId: data.userId,
            mainKey: data.key
        }, success:function(res){

        }
    });
}
function chatIng(data){
    var total = 0;
    console.log(data);
    for(var i=0; i<data.length; i++){
        total += Number(data[i].CHAT_COUNT);
    }
    $(".progress_all_num").text("총 "+moneyComma(total)+"건");
    for(var i=0; i<data.length; i++){
        var count = Number(data[i].CHAT_COUNT);
        
        
        if(data[i].CODE_CODE == "0050001"){
            var persent=0;
            if(count > 0){
                persent = Math.round((count / total) * 100);
            }
            
            $("#ing_0050001").find(".percent_txt").text(persent+"%");
            $("#ing_0050001").find(".progress_bar").css("width", persent+"%");
            $("#ing_0050001").find(".progress_num").text(moneyComma(count)+"건");
        }else if(data[i].CODE_CODE == "0050002"){
            var persent=0;
            if(count > 0){
                persent = Math.round((count / total) * 100);
            }
            $("#ing_0050002").find(".percent_txt").text(persent+"%");
            $("#ing_0050002").find(".progress_bar").css("width", persent+"%");
            $("#ing_0050002").find(".progress_num").text(moneyComma(count)+"건");
        }else if(data[i].CODE_CODE == "0050003"){
            var persent=0;
            if(count > 0){
                persent = Math.round((count / total) * 100);
            }
            $("#ing_0050003").find(".percent_txt").text(persent+"%");
            $("#ing_0050003").find(".progress_bar").css("width", persent+"%");
            $("#ing_0050003").find(".progress_num").text(moneyComma(count)+"건");
        } else if(data[i].CODE_CODE == "0050004"){
            var persent=0;
            if(count > 0){
                persent = Math.round((count / total) * 100);
            }
            $("#ing_0050004").find(".percent_txt").text(persent+"%");
            $("#ing_0050004").find(".progress_bar").css("width", persent+"%");
            $("#ing_0050004").find(".progress_num").text(moneyComma(count)+"건");
        }
    }
    
}
function scrollBottom(el){
    console.log(el[0].scrollHeight);
    setTimeout(function(){
        el.animate({scrollTop : el[0].scrollHeight}, 600);
    }, 100);
}

function adminChat(el, date){
    var chat = "";

    chat += "<div class='chat_send_box chat_send_right'>"
        + "<div class='chat_send_cont chat_send_profile'></div>"
        + "<div class='chat_send_cont chat_send_text'>"
        + "<div class='chat_send_div'>"
        + "<p class='chat_send_txt'>"+el+"</p>"
        + "</div>"
        + "</div>"
        + "<div class='chat_send_cont chat_send_time'>"
        + "<p class='chat_send_time_txt'>"+date+"</p>"
        + "</div>"
        + "</div>";
        return chat;
    
}
function userChat(el, date){
    var chat = "";
    chat += "<div class='chat_send_box chat_send_right'>"
          + "<div class='chat_send_cont chat_send_text'>"
          + "<div class='chat_send_div'>"
          + "<p class='chat_send_txt'>"+el+"</p>"
          + "</div>"
          + "</div>"
          + "<div class='chat_send_cont chat_send_time'>"
          + "<p class='chat_send_time_txt'>"+date+"</p>"
          + "</div>"
          + "</div>";
    
    return chat;
}
function chatBot(chatBotData, list){
    var item ="";
    var startMsg;
    var checkMsg;

    for(var i=0;i<chatBotData.length; i++){
        if(chatBotData[i].CODE_CODE == "0060001"){
            startMsg = chatBotData[i];
        }else if(chatBotData[i].CODE_CODE == "0060002"){
            checkMsg = chatBotData[i];
        }
    }
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
function fileCheck_main( imgname){
    var imgItem = "";
    if(imgname.toLowerCase().indexOf(".png") != "-1"
                    || imgname.toLowerCase().indexOf(".jpg") != "-1"
                    || imgname.toLowerCase().indexOf(".jpeg") != "-1"){
                        imgItem = "[사진]";
    }else if(imgname.toLowerCase().indexOf(".mp4") != "-1"
    || imgname.toLowerCase().indexOf(".avi") != "-1"
    || imgname.toLowerCase().indexOf(".mkv") != "-1"
    || imgname.toLowerCase().indexOf(".mov") != "-1"){
        imgItem = "[동영상]";
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
        imgItem = "[파일]";
    }
    return imgItem;
}
function mainScroll(){
    mainPage = Number(mainPage)+Number(mainPageSize);
    if(mainTotal <= mainPage){
        mainPage = mainTotal;
    }
    mainListAppend();
}
function mainListAppend(){
    $.ajax({
        url:"/mysql/chat",
        data :{
            xml: "chat_list_admin",
            status: '',
            mainPage: mainPage,
            mainPageSize: mainPageSize
        }, success:function(res){
            
            if(res.length>0){
                mainTotal = Number(res[0].TOTAL);
                $("#chat_list_ul").append(mainList(res));
                $("#chat_list_ul").css("diplay","block");
            }
        }
    });
}