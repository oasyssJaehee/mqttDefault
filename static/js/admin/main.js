

function init(){
    $.loading.start('');
    $.ajax({
        url:"/mysql/room",
        data:{
            xml:"room_main_list",
            bsCode: pad(bsCode, 7),
            dcod: mainDcode,
            statu:mainStatu,
            roomSearch: mainRoomSearch,
            party:mainKeyParty,
            keyStatus:mainKeyStatus
        },success:function(res){
            var item ="";
            if(res.length == 0){
                $("#main_tot_txt").text("총 0개");
            }else{
                $("#main_tot_txt").text("총 "+comma(res[0].counts)+"개");
            }
            for(var i=0;i<res.length;i++){
                var stateStr = "";
                var stateClass = "";
                var lineStateClass = "";
                var userKey="off";
                var maidKey="off";
                var masterKey="off";
                var useTime = "";

                if(res[i].ROOM_CODE_STATU == "0030001"){
                    stateStr = "체크인";
                    stateClass = "js";
                    lineStateClass = "js";
                }else if(res[i].ROOM_CODE_STATU == "0030006"){
                    stateStr = "체크인";
                    stateClass = "js";
                    lineStateClass = "js";
                }else if(res[i].ROOM_CODE_STATU == "0030005"){
                    stateStr = "더티";
                    stateClass = "dt";
                    lineStateClass = "dt";
                }else{
                    stateStr = "공실";
                    stateClass = "gs";
                    lineStateClass = "gs";
                }
                if(res[i].BRIDGE_TRAN_RSPK != ''){
                    userKey = "on"
                    useTime += "<h2 class='view_tit view_tit03'>사용기간</h2>"
                             + "<p class='view_txt view_txt02'>"+res[i].BRIDGE_TRAN_IDATE+" ~ "+res[i].BRIDGE_TRAN_ODATE+"</p>";
                }else{
                    useTime += "<h2 class='view_tit view_tit03'></h2>"
                             + "<p class='view_txt view_txt02'></p>";
                }
                if(res[i].ROOM_PASS_CLEANER != ''){
                    maidKey = "on"
                }
                if(res[i].ROOM_PASS_MASTER != ''){
                    masterKey = "on"
                }
                if(res[i].ROOM_CODE_CLEAN == "1"){
                    lineStateClass = "cl";
                }
                item += "<li data-rono='"+res[i].ROOM_CODE_NUM+"' data-rtype='"+res[i].ROOM_CODE_DCOD+"' data-rspk='"+res[i].BRIDGE_TRAN_RSPK+"' class='view_grp_list "+lineStateClass+" on'>"
                      + "<div class='view_tbox view_tbox01'>"
                      + "<div class='room_state_box'>"
                      + "<span class='room_state "+lineStateClass+"'>"+stateStr+"</span>"
                      + "</div>"
                      + "<div class='view_tit_grp'>"
                      + "<div class='view_tit_box'>"
                      + "<h2 class='view_tit view_tit01'>"+res[i].ROOM_CODE_NUM+"</h2>"
                      + "</div>"
                      + "<div class='view_tit_box'>"
                      + "<h2 class='view_tit view_tit02 view_tit_state'>"+res[i].ROOM_CODE_HNAM+"</h2>"
                      +"</div>"
                      + "</div>"
                      + "</div>"
                      + "<div class='view_tbox view_tbox03'>"
                      + "<div class='key_tbox key_tbox01 "+userKey+"'>"
                      + "<div class='key_icon key_icon01'></div>"
                      + "<p class='view_txt view_txt01'>폰키</p>"
                      + "</div>"
                      + "<div class='key_tbox key_tbox02 "+maidKey+"'>"
                      + "<div class='key_icon key_icon02'></div>"
                      + "<p class='view_txt view_txt01'>메이드키</p>"
                      + "</div>"
                      + "<div class='key_tbox key_tbox03 "+masterKey+"'>"
                      + "<div class='key_icon key_icon03'></div>"
                      + "<p class='view_txt view_txt01'>마스터키</p>"
                      + "</div>"
                      + "</div>"
                      + "<div class='view_tbox view_tbox02'>"
                      + useTime
                      + "</div>"
                      + "</li>";
            }
            $(".view_grp_listbox").empty();
            $(".view_grp_listbox").append(item);
            $.loading.end();
        }

    });
}
function roomPopup(){
    popReset();
    $("#pop_info_content").css("display","block");

    var el = $("#pop_tab_ul li");
    el.siblings().removeClass("active");
    el.first().addClass("active");
    $("#pop_js").css("display","none");
    $("#pop_cl").css("display","none");
    $("#pop_gs").css("display","none");
    $("#pop_dt").css("display","none");
    $("#pop_rono").text("");
    $("#pop_type").text("");
    roomInfo();
}
function roomInfo(){
    $.ajax({
        url:"/mysql/room",
        data:{
            xml:"room_select_info",
            rono:rono,
            rtype:rtype,
            rspk:rspk,
            bsCode: pad(bsCode, 7)
        },success:function(res){
            console.log(res);
            cleanRono = res[0].ROOM_CODE_NUM;
            cleanStatus = res[0].ROOM_CODE_STATU;
            cleanStatu_oo = res[0].CODE_CONTENT;
            cleanAcno = res[0].BRIDGE_TRAN_ACNO;

            if(res[0].ROOM_CODE_CLEAN == "1"){
                $("#pop_clean_btn").css("display","block");
            }else{
                $("#pop_clean_req_btn").css("display","block");
            }
            if(res[0].ROOM_CODE_STATU == "0030001"){
                $("#pop_js").css("display","block");
            }else if(res[0].ROOM_CODE_STATU == "0030005"){
                $("#pop_dt").css("display","block");
            }else{
                $("#pop_gs").css("display","block");
            }
            $("#pop_rono").text(res[0].ROOM_CODE_NUM);
            $("#pop_type").text(res[0].ROOM_CODE_HNAM);
            if(res[0].BRIDGE_TRAN_RSPK != ""){
                $("#pop_user_onoff").removeClass("off");
                $("#pop_user_onoff").addClass("on");
            }
            if(res[0].ROOM_PASS_CLEANER != ""){
                $("#pop_maid_onoff").removeClass("off");
                $("#pop_maid_onoff").addClass("on");
                $("#pop_maid_pw").val(res[0].ROOM_PASS_CLEANER);
            }else{
                $("#pop_maid_onoff").removeClass("on");
                $("#pop_maid_onoff").addClass("off");
                $("#pop_maid_pw").val("");
            }
            if(res[0].ROOM_PASS_MASTER != ""){
                $("#pop_master_onoff").removeClass("off");
                $("#pop_master_onoff").addClass("on");
                $("#pop_master_pw").val(res[0].ROOM_PASS_MASTER);
            }else{
                $("#pop_master_onoff").removeClass("on");
                $("#pop_master_onoff").addClass("off");
                $("#pop_master_pw").val("");
            }
            if(res[0].BRIDGE_TRAN_RSPK != ""){
                $("#pop_key_info").css("display","block");
                $("#pop_key_name").val(res[0].BRIDGE_TRAN_GNAME);
                $("#pop_key_phone").val(phoneHipen(res[0].BRIDGE_TRAN_PHONE));
                $("#pop_key_idate").val(res[0].BRIDGE_TRAN_IDATE);
                $("#pop_key_odate").val(res[0].BRIDGE_TRAN_ODATE);
                if(res[0].ROOM_PASS_USER != ""){
                    $("#pop_key_sett_on").addClass("active");
                    $("#pop_key_sett_off").removeClass("active");
                }else{
                    $("#pop_key_sett_on").removeClass("active");
                    $("#pop_key_sett_off").addClass("active");
                    
                }
            }else{
                $("#pop_key_info").css("display","none");
            }
            $.loading.end();
        }
    });
}

function keyScroll(){
    keyPage = Number(keyPage)+Number(keyPageSize);
    if(keyTotal <= keyPage){
        keyPage = keyTotal;
    }
    
    keyLog();
}
function keyLog(){
    $.ajax({
        url:"/mysql/room",
        data:{
            xml: "key_log_select",
            rono:rono,
            rtype:rtype,
            rspk:rspk,
            bsCode: pad(bsCode, 7),
            page :keyPage,
            pageSize: keyPageSize
        }, success:function(res){
            if(res.length > 0){
                keyTotal = res[0].counts;
                $("#key_total_h2").text("총 "+comma(keyTotal)+"건");
                var item ="";
                for(var i=0;i<res.length; i++){
                    var type = "";
                    var tf ="";
                    if(res[i].API_LOG_TYPE == "create"){
                        type = "발급";
                    }else if(res[i].API_LOG_TYPE == "update"){
                        type = "변경";
                    }else if(res[i].API_LOG_TYPE == "delete"){
                        type = "취소";
                    }
                    if(res[i].API_LOG_TF == "T"){
                        tf = "<td class='table_list_td text_left'>성공</td>";
                    }else{
                        tf = "<td style='color:red;' class='table_list_td text_left'>실패</td>";
                    }
                        
                    item += "<tr>"
                          + "<td class='table_list_td text_left'>"+res[i].API_LOG_ACNO+"</td>"
                          + "<td class='table_list_td text_left'>"+res[i].API_LOG_GNAME+"</td>"
                          + "<td class='table_list_td text_left'>"+phoneHipen(res[i].PHONE)+"</td>"
                          + "<td class='table_list_td text_left'>"+res[i].API_LOG_IDATE+"</td>"
                          + "<td class='table_list_td text_left'>"+res[i].API_LOG_ODATE+"</td>"
                          + "<td class='table_list_td text_left'>"+type+"</td>"
                          + tf
                          + "<td class='table_list_td text_left'>"+res[i].API_LOG_DATE+"</td>"
                          + "<td class='table_list_td text_left'>"+res[i].API_LOG_USER+"</td>"
                          + "</tr>"
                }
                $("#key_log_table tbody").append(item);
            }else{
                if(keyTotal == "0"){
                    $("#key_total_h2").text("총 "+comma("0")+"건");
                    $("#key_log_empty").css("display","block");
                }
                
            }
            $.loading.end();
        }
    });
}
function actionScroll(){
    actionPage = Number(actionPage)+Number(actionPageSize);
    if(actionTotal <= actionPage){
        actionPage = actionTotal;
    }
    actionLog();
}
function actionLog(){
    $.ajax({
        url:"/mysql/room",
        data:{
            xml: "action_log_select",
            rono:rono,
            rspk:rspk,
            bsCode: removePad(bsCode),
            page:actionPage,
            pageSize:actionPageSize,
            code: actionCode
        }, success:function(res){
            console.log(res);
            if(res.length > 0){
                actionTotal = res[0].counts;
                $("#action_total_h2").text("총 "+comma(actionTotal)+"건");
                var item ="";
                for(var i=0;i<res.length; i++){
                    var action = "";
                    var diff ="";
                    var diffStr = res[i].DIFF;
                    if(res[i].MQTT_ACTION_CMD == "204"){
                        if(res[i].MQTT_ACTION_STATE == "1"){
                            action = "오픈";
                        }else if(res[i].MQTT_ACTION_STATE == "15"){
                            action = "비밀번호 설정";
                        }else if(res[i].MQTT_ACTION_STATE == "12"){
                            action = "비밀번호 사용 시간";
                        }else if(res[i].MQTT_ACTION_STATE == "5"){
                            action = "도어락 현재 시간";
                        }else if(res[i].MQTT_ACTION_STATE == "23"){
                            action = "마스터 비밀번호 설정";
                        }else if(res[i].MQTT_ACTION_STATE == "24"){
                            action = "메이드 비밀번호 설정";
                        }
                    }else if(res[i].MQTT_ACTION_CMD == "210"){
                        if(res[i].MQTT_ACTION_STATE == "1"){
                            action = "브릿지 연결";
                        }
                    }
                    if(Number(res[i].DIFF) > 15){
                        diff = "style='color:red;'";
                    }
                    if(Number(res[i].DIFF) > 30){
                        diffStr = "00";
                    }
                    item += "<tr>"
                          + "<td class='table_list_td text_left'>"+action+"</td>"
                          + "<td "+diff+" class='table_list_td text_left'>"+diffStr+"</td>"
                          + "<td class='table_list_td text_left'>"+res[i].OPEN_TYPE+"</td>"
                          + "<td class='table_list_td text_left'>"+res[i].MQTT_ACTION_REQDATE+"</td>"
                          + "<td class='table_list_td text_left'>"+res[i].BRIDGE_TRAN_GNAME+"</td>"
                          + "</tr>"
                }
                $("#pop_action_table tbody").append(item);
            }else{
                if(actionTotal == "0"){
                    $("#action_total_h2").text("총 "+comma("0")+"건");
                    $("#action_log_empty").css("display","block");
                }
                
            }
            $.loading.end();
        }
    });
}
function popTabClick(tab, el){
    popReset();
    el.siblings().removeClass("active");
    el.addClass("active");
    if(tab == "info"){
        $("#pop_key_log_content").css("display","none");
        $("#pop_action_log_content").css("display","none");
        $("#pop_info_content").css("display","block");

        roomInfo();
    }else if(tab == "key_log"){
        $("#pop_info_content").css("display","none");
        $("#pop_action_log_content").css("display","none");
        $("#pop_key_log_content").css("display","block");

        keyLog();
    }else if(tab == "action_log"){
        $("#pop_info_content").css("display","none");
        $("#pop_key_log_content").css("display","none");
        $("#pop_action_log_content").css("display","block");

        actionLog();
    }
}
function popReset(){
    
    actionPage = 0;
    actionTotal = 0;
    keyPage = 0;
    keyTotal = 0;
    actionCode = "";
    $("#pop_action_table tbody").empty();
    $("#key_log_table tbody").empty();
    $("#pop_key_log_content").css("display","none");
    $("#pop_action_log_content").css("display","none");
    $("#pop_info_content").css("display","none");
    
    $("#pop_maid_pw").val("");
    $("#pop_key_name").val("");
    $("#pop_key_phone").val("");
    $("#pop_key_idate").val("");
    $("#pop_key_odate").val("");
    $("#key_log_empty").css("display","none");
    $("#pop_clean_btn").css("display","none");
    $("#pop_clean_req_btn").css("display","none");
}

function actionCheck(limit){
    var count = 0;
    actionInterver = setInterval(function(){
        count++;
        if(count > limit){
            clearInterval(actionInterver);
            $("#connect").removeClass("on");
            $("#connect").addClass("off");
            Alert("도어락 연결을 확인해 주세요.");
            bleConnect = false;
            $.loading.end();
        }
    }, 1000);
}

function mqttCheck(){
    bleConnectTimerText();
    var mqttCount = 0;
    mqttInterver = setInterval(function(){
        mqttCount++;
        if(mqttCount > 5){
            clearInterval(mqttInterver);
            bleConnectClear();
            Alert("브릿지 연결을 확인해 주세요.");
            bleConnect = false;
            $.loading.end();
        }
    }, 1000);
}

//도어락 정보 저장
function door_sett(data){
    $.ajax({
        url:"./doorSett",
        data:data
        , success:function(res){
        }
    });
}
function doorStart(){
    $.ajax({
        url:"/mysql/mqtt",
        data:{
            xml: "door_time_check",
            userId: userId,
            rono:rono,
            bsCode:pad(bsCode, 7)
        },success:function(res2){
            console.log(res2);
            if(res2.length == 0){
                $.loading.start('도어락 기초 설정 중 입니다.');
                $.ajax({
                    url:"/doorTimeSett",
                    data:{
                        userId: userId,
                        open: "0110001",
                        topic: "oasyss32/"+topic
                    }, success:function(res3){
                        actionCheck(10);
                    }
                });
            }else{
                if(res2[0].ROOM_TIME_DOOR == ""){
                    $.loading.start('도어락 기초 설정 중 입니다.');
                    $.ajax({
                        url:"/doorTimeSett",
                        data:{
                            userId: userId,
                            open: "0110001",
                            topic: "oasyss32/"+topic
                        }, success:function(res3){
                            actionCheck(10);
                        }
                    });
                }
            }
        }
    });
}
function socketBleConnect(){
    $.loading.start('도어락 연결 중입니다.');
        
    $.ajax({
        url:"/mqttCheck",
        data:{
            topic: "oasyss32/"+topic,
            userId: userId
        },
        success : function(result){
            mqttCheck();
        }
    });
}
function userCheck(){
    $.ajax({
        url:"/socket/room",
        data:{
            name: removePad(bsCode)+"_"+rono,
            id:socket.id
        },
        success:function(res){
            if(Number(res.room_size) == 0){
                socketConnect = true;
                socket.emit("joinAdmin", removePad(bsCode)+"_"+rono, userId, "1");
                $.loading.start('도어락 연결 중입니다.');
                $.ajax({
                    url:"/mqttCheck",
                    data:{
                        topic: "oasyss32/"+topic,
                        userId: userId
                    },
                    success : function(result){
                        mqttCheck();
                    }
                });  

            }else{
                socketConnect = false;
                Alert("현재 사용중인 폰키 입니다.");
            }
        }
    });
}