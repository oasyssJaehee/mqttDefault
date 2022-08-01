function popReset(){
    $("#pop_user_div").css("display", "block");
    $("#pop_member_div").css("display", "none");
    $("#pop_inout_div").css("display", "none");
    $("#pop_addr_div").css("display", "none");
    $("#pop_user_save_btn2").css("display", "none");
    $("#pop_chat_div").css("display", "none");
    $(".pop_tab_listbox li").removeClass("active");
    $(".pop_tab_listbox li").eq(0).addClass("active");
    $("input[name='pop_member_name']").val('');
    $("input[name='pop_member_edate']").val('');
    $("input[name='pop_member_id']").val('');
    $("input[name='pop_member_rs']").val('');
    $(".block_cont_none_list").css("display", "block");
    $(".block_cont_click").css("display", "none");
    $("input[name='pop_user_name']").val('');
    $("input[name='pop_user_tel']").val('');
    $("input[name='pop_user_id']").val('');
    $("input[name='pop_user_id']").attr("readonly", false);
    
    $("select[name='sub_user_list']").empty();
    $(".member_listbox").empty();
    $(".key_list_tb tbody").empty();
    
    $(".no_member").css("display","block");
    $("#sub_user_img").css("background-image", "url(/static/img/web/def_user_icon02.png)");
    $("#user_img").css("background-image", "url(/static/img/web/def_user_icon02.png)");
    $("#pop_user_save_btn").css("display","block");
}
var mainKey = "";
function chatList(){
    mainKey = "";
    console.log(mainKey);
    console.log(mainUserId);
    $.loading.start('Loading...');

    $.ajax({
        url:"/mysql/chat",
        data:{
            xml: "chat_select_common",
            userId: mainUserId
        }, success: function(res){
            console.log(res);
            if(res.length>0){
                mainKey = res[0].CHAT_MAIN_KEY;
            }
            
            // socket.on("refresh", function(data){
            //     init();
            // });
            console.log(mainKey);
            if(mainKey){
                socket.on("recvChat", function(data){
                
                    if(mainKey != ""){
                        $("#chat_sub_box").append(chatRecev(data));
                        var viewData = {};
                        viewData = {
                            key: mainKey,
                            userId: userId
                        }
                        if(mainStatus != "0050001" ){
                            updateView(viewData);
                        }
                    }
                    scrollBottom($('#chat_sub_box'));
                });
                $.ajax({
                    url:"/mysql/chat",
                    data:{
                        xml: "chat_select_admin",
                        mainKey: mainKey
                    }, success: function(res){
                        console.log(res);
                        socket.emit("joinRoom", mainKey, userId, "1");
                        $("#chat_sub_box").empty();
                        $("#chat_sub_box").append(subList(res));
                        $("#user_info_div").css("display", "block");
                        $(".image-popup-no-margins").magnificPopup({
                            type: 'image',
                            closeOnContentClick: true,
                            closeBtnInside: true,
                            fixedContentPos: true,
                            mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
                            image: {
                                verticalFit: true
                            },
                            zoom: {
                                enabled: true,
                                duration: 300 // don't foget to change the duration also in CSS
                            }
                        });
            
                        var addr = res[0].USER_APART+" "+ res[0].USER_ADDR1+" "+res[0].USER_ADDR2+"호";
                        $("#info_name").text(res[0].USER_NAME);
                        $("#info_addr").text(addr);
            
                        var img = res[0].USER_IMGNAME;
                        if(img != null && img != ""){
                            var path = res[0].USER_IMGPATH;
                            var imgname = res[0].USER_IMGNAME;
                            selectUserImg = res[0].USER_IMGNAME;
                            selectUserPath= res[0].USER_IMGPATH;
                            $("#main_user_profile").css("background-image", "url("+path+imgname+")");
                            // img = "<img style='margin:0;width:100%; height:100%; border-radius:20px !important;' src='"+path+imgname+"' class='rounded float-left' alt=''></img>";
                        }else{
                            img = "";
                            selectUserImg = "";
                            selectUserPath = "";
                            $("#main_user_profile").css("background-image", "url(/static/img/web/def_user_icon.png)");
                        }
                        
                        
                        
                        scrollBottom($('#chat_sub_box'));
                        $.loading.end();
                    }
                });
            }else{
                $("#chat_sub_box").empty();
                $.loading.end();
            }
        }
    });

}

function dcodList(hotelCode){
    $.ajax({
        url:"/mysql/common",
        data:{
            xml: "codeList",
            cod: "003"
            

        },success: function(res){
            var item="";
            console.log(res);
            if(res.length == 0){
                item = "<td colspan='1' class='key_list_td key_list_td_none'>조회내역이 없습니다.</td>";
            }else{
                for(var i=0; i<res.length; i++){
					
                    item += "<tr class='datarow dcod_row' data-dcod='"+res[i].CODE_CODE+"'><td class='key_list_td key_list_td02'>"+res[i].CODE_CONTENT+"</td>  "+
                    "</tr>	  ";
                    // "<td class='key_list_td key_list_td02'>  "+
                    // "    <input style='display:none;' type='checkbox' class='ck ck_dcod' id='code_docd_"+i+"' data-dcod='"+res[i].CODE_CODE+"'>  "+
                    // "    <label class='dis_inblock ck_btn' for='code_dcod_"+i+"'></label>  "+
                    // "</td></tr>	  ";
                }
            }
            
            $(".key_list_tb_dcod tbody").empty();
            $(".key_list_tb_dcod tbody").append(item);
        }
    });
    
}
function addrList(dcod){
    $.ajax({
        url:"/mysql/mqtt",
        data:{
            xml: "select_mqtt_list_floor",
            dcod: dcod
            

        },success: function(res){
            var item="";
            console.log(res);
            if(res.length == 0){
                item = "<td colspan='2' class='key_list_td key_list_td_none'>조회내역이 없습니다.</td>";
            }else{
                for(var i=0; i<res.length; i++){
					
                    item += "<tr class='datarow floor_row'><td class='key_list_td key_list_td02'>"+res[i].CODE_CONTENT+"</td>  "+
                    "<td class='key_list_td key_list_td02'>  "+
                    "    <input style='display:none;' type='checkbox' class='ck ck_floor' id='code_floor_"+i+"' data-floor='"+res[i].MQTT_LIST_FLOOR+"'>  "+
                    "    <label class='dis_inblock ck_btn' for='code_floor_"+i+"'></label>  "+
                    "</td></tr>	  ";
                }
            }
            
            $(".key_list_tb_floor tbody").empty();
            $(".key_list_tb_floor tbody").append(item);
            $.ajax({
                url: "/mysql/mqtt",
                data:{
                    xml: "mqtt_list",
                    hotelCode: hotelCode,
                    dcod : dcod,
                    floor : ''
                },success: function(res){
                    var item="";
                    console.log(res);
                    if(res.length == 0){
                        item = "<td colspan='2' class='key_list_td key_list_td_none'>조회내역이 없습니다.</td>";
                    }else{
                        for(var i=0; i<res.length; i++){
                            
                            item += "<tr class='datarow addr_row'><td class='key_list_td key_list_td02'>"+res[i].FLOOR_NAME+"</td><td class='key_list_td key_list_td02'>"+res[i].MQTT_LIST_NAME+"</td>  "+
                            "<td class='key_list_td key_list_td02'>  "+
                            "    <input style='display:none;' type='checkbox' class='ck ck_addr' id='code_addr_"+i+"' data-floor='"+res[i].MQTT_LIST_FLOOR+"' data-addr='"+res[i].MQTT_LIST_KEY+"'>  "+
                            "    <label class='dis_inblock ck_btn' for='code_addr_"+i+"'></label>  "+
                            "</td></tr>	  ";
                        }
                    }
                    
                    $(".key_list_tb_addr tbody").empty();
                    $(".key_list_tb_addr tbody").append(item);
                    $.ajax({
                        url:"/mysql/mqtt",
                        data:{
                            xml: "addr_list",
                            userID: mainUserId
                
                        },success: function(res){
                            var item="";
                            console.log(res);
                            if(res.length > 0){
                                for(var i=0; i<res.length; i++){
                                    $(".ck_addr[data-addr='"+res[i].USER_ADDR+"']").click();
                                    var fl = $(".ck_addr[data-addr='"+res[i].USER_ADDR+"']").data("floor");
                                    $(".ck_floor[data-floor='"+fl+"']").prop("checked", true);
                                }
                            }
                            
                        }
                    });
                }
            });
        }
    });
    

    
}
function addrSave(){
    if($(".dcod_row.active").length < 1){
        Alert("동을 선택해주세요.");
        return;
    }
    console.log($(".dcod_row.active"));
    console.log($(".dcod_row.active").data('dcod'));
    var dcod = ($(".dcod_row.active").length > 0) ? $(".dcod_row.active").data('dcod') : '';
    $.ajax({
        url:"/mysql/mqtt",
        data:{
            xml: "addr_delete",
            dcod: dcod,
            userID: mainUserId

        },success: function(res){
            console.log(res);
            var addrs = $('.ck_addr:checked');
            console.log(addrs);
            for (let i = 0; i < addrs.length; i++) {
                const addr = $(addrs[i]);
                $.ajax({
                    url:"/mysql/mqtt",
                    data:{
                        xml: "addr_insert",
                        userID: mainUserId,
                        addr : addr.data('addr')
            
                    },success: function(res){
                        console.log(res);
                    }
                });
            }
            Alert("저장되었습니다.");
                
            
            
        }
    });
}
//서브유저 리스트
function popMemberList(){
    $.ajax({
        url: "/mysql/user",
        data:{
            xml: "select_user_list",
            user_key:userKey
        },success:function(data){
            if(data.length > 0){
                var item="";
                for(var i=0; i<data.length; i++){
                    var userImg = "";
                    if(data[i].USER_SUB_IMGNAME != ''){
                        var path = data[i].USER_SUB_IMGPATH;
                        var imgName = data[i].USER_SUB_IMGNAME;
                        $("#sub_user_img").css("background-image", "url("+path+imgName+")");
                        userImg = "style='background-image: url("+path+imgName+");'";
                    }
                    item += "<li class='member_list' data-subKey='"+data[i].USER_SUB_KEY+"'>"
                        + "<div class='member_list_widthbox dis_flex_row'>"
                        + "<div class='member_list_width member_list_width01'>"
                        + "<div class='member_profile_img' "+userImg+"></div>"
                        + "</div>"
                        + "<div class='member_list_width member_list_width02'>"
                        + "<h2 class='member_list_tit'>"+data[i].USER_SUB_NAME+"</h2>"
                        + "</div>"
                        + "<div class='member_list_width member_list_width03'>"
                        +"</div>"
                        + "</div>"
                        + "</li>";
                }
                $("input[name='pop_member_name']").val('');
                $("input[name='pop_member_edate']").val('');
                $("input[name='pop_member_id']").val('');
                $("input[name='pop_member_rs']").val('');
                $(".block_cont_none_list").css("display", "block");
                $(".block_cont_click").css("display", "none");
                $(".member_listbox").empty();
                $(".member_listbox").append(item);
                $(".no_member").css("display","none");
            }else{
                $(".no_member").css("display","block");
            }
            
        }
    });
}
//서브 유저 선택
function subUserSelect(){
    $.ajax({
        url: "/mysql/user",
        data:{
            xml: "select_user_id",
            user_key: userKey,
            sub_key: subKey
        },success:function(res){
            $("input[name='pop_member_name']").val(res[0].USER_SUB_NAME);
            var edate = res[0].USER_SUB_EDATE;
            if(edate.length==8){
                edate = edate.substring(0,4)+"-"+edate.substring(4,6)+"-"+edate.substring(6,8);
            }
            if(res[0].USER_SUB_LEVEL == "0010006"){
                $("input[name='pop_member_level']").val("방문객");
            }else{
                $("input[name='pop_member_level']").val("가족");
            }
            $("input[name='pop_member_edate']").val(edate);
            $("input[name='pop_member_id']").val(res[0].USER_SUB_ID);
            $("input[name='pop_member_rs']").val(res[0].USER_SUB_RS);
            $("select[name='pop_member_use'").val(res[0].USER_SUB_USE);
            $("input[name='pop_member_id']").attr("readonly", true);
            var userImg = "";
            if(res[0].USER_SUB_IMGNAME != ''){
                var path = res[0].USER_SUB_IMGPATH;
                var imgName = res[0].USER_SUB_IMGNAME;
                // userImg = "<img style='margin:0;width:100%; height:100%; border-radius:20px !important;' src='"+path+imgName+"' class='rounded float-left' alt=''></img>";
                $("#sub_user_img").css("background-image", "url("+path+imgName+")");
                // $("#sub_user_img").append(userImg);
            }
            
        }
    });
}
//메인유저 정보
var mainUserId = "";
var mainUser = "";
function popUserInfo(){
    $.ajax({
        url: "/mysql/user",
        data:{
            xml: "user_select_admin",
            userKey: userKey
        }, success:function(data){
            mainUser = data[0].USER_NAME;
            mainUserId = data[0].USER_ID;
            $("input[name='pop_user_name']").val(data[0].USER_NAME);
            $("input[name='pop_user_tel']").val(data[0].USER_TEL);
            $("input[name='pop_user_id']").val(data[0].USER_ID);
            $("select[name='pop_user_addr1']").val(data[0].USER_ADDR1);
            $("select[name='pop_user_appo']").val(data[0].USER_APPO);
            $("input[name='pop_user_id']").attr("readonly", true);
            $("#userTitle").html("회원상세 - <em class='' style='font-size: 22px;'>"+data[0].USER_NAME+" "+data[0].CODE_CONTENT+"/"+data[0].ROOM_CODE_NUM+"호</em>");
            $(".pop_tab_list").show();
            var edate = data[0].USER_EDATE;
            if(edate.length==8){
                edate = edate.substring(0,4)+"-"+edate.substring(4,6)+"-"+edate.substring(6,8);
            }
            $("input[name='pop_user_edate']").val(edate);
            if(data[0].USER_IMGNAME != null){
                var path = data[0].USER_IMGPATH;
                var imgName = data[0].USER_IMGNAME;
                $("#user_img").css("background-image", "url("+path+imgName+")");
            }else{
                $("#user_img").css("background-image", "url(/static/img/web/def_user_icon02.png)");
                
            }
            $.ajax({
                url:"/mysql/room",
                data:{
                    xml : "empty_room_list",
                    hotelCode: hotelCode,
                    dcod: $("select[name='pop_user_addr1']").val()
                },
                success: function(res){
                    var item = "";
                    item += "<option value='"+data[0].USER_ADDR2+"'>"+$("select[name='pop_user_addr1'] option:selected").text() + " " + data[0].ROOM_CODE_NUM+"호</option>"
                    userAddr2 += "<option value='"+data[0].USER_ADDR2+"'>"+$("select[name='pop_user_addr1'] option:selected").text() + " " + data[0].ROOM_CODE_NUM+"호</option>"
                    for(var i=0; i<res.length; i++){
                        item += "<option value='"+res[i].ROOM_CODE_CODE+"'>"+$("select[name='pop_user_addr1'] option:selected").text() + " " + res[i].ROOM_CODE_NUM+"호</option>"
                    }
                    $("select[name='pop_user_addr2']").empty();
                    $("select[name='pop_user_addr2']").append(item);
                    $("select[name='pop_user_addr2']").val(data[0].USER_ADDR2);
                    
                    
                }
            });
        }
    });
}
function userList(){
    $.ajax({
        url : "/mysql/user",
        data : {
            xml : "select_user_list",
            user_key : userKey
        },success : function(res){
            console.log(res);
            var item = "<option value=''>전체</option>";
            item += "<option value='"+mainUserId+"'>"+mainUser+"</option>";
            for(var i = 0; i < res.length; i++){
                item += "<option value='"+res[i].USER_SUB_ID+"'>"+res[i].USER_SUB_NAME+"</option>"
            }
            $("select[name='sub_user_list']").empty();
            $("select[name='sub_user_list']").append(item);
        }, error : function(e){
        }
    });
}
var inOutTotal=0;
var inOutPage = 0;
var inOutPageSize = 50;
var inOutTimer;
var inOutSdate = "";
var inOutEdate = "";
var subUser = "";
function openList(){
    console.log(inOutSdate);
    console.log(inOutEdate);
    $.ajax({
        url:"/mysql/mqtt",
        data:{
            xml: "mqtt_open_list_host",
            userId: mainUserId,
            userKey: userKey,
            page: inOutPage,
            pageSize: inOutPageSize,
            sdate: inOutSdate,
            edate: inOutEdate,
            subUser: subUser

        },success: function(res){
            var item="";
            console.log(res);
            if(res.length == 0){
                item = "<td colspan='6' class='key_list_td key_list_td_none'>조회내역이 없습니다.</td>";
            }else{
                for(var i=0; i<res.length; i++){
                    var diff = "";
					if(Number(res[i].DIFF) > 10){
						diff = "style='color:red;'";
					}
					
                    var userNameTd = "";
                    userNameTd ="<td "+diff+" class='key_list_td key_list_td02'>"+res[i].USER_NAME+"</td>";
                    var userIdTd = "";
                    userIdTd ="<td "+diff+" class='key_list_td key_list_td02'>"+res[i].MQTT_ACTION_USER+"</td>";
                    var dcodTd = "";
                    dcodTd ="<td "+diff+" class='key_list_td key_list_td02'>"+res[i].DCOD_NAME+"</td>";
                    var floorTd = "";
                    floorTd ="<td "+diff+" class='key_list_td key_list_td02'>"+res[i].FLOOR_NAME+"</td>";
                    var doorTd = "";
                    doorTd ="<td "+diff+" class='key_list_td key_list_td02'>"+res[i].MQTT_LIST_NAME+"</td>";
                    // var roomNumTd = "";
                    // roomNumTd ="<td "+diff+" class='key_list_td key_list_td02'>"+res[i].ROOM_NUM+"</td>";
                    
                    item += "<tr>"
                        + "<td class='key_list_td key_list_td01'>"+res[i].MQTT_ACTION_REQDATE+"</td>"
                        + dcodTd
                        + floorTd
                        + doorTd
                        + userNameTd
                        + userIdTd
                        + "<td class='key_list_td key_list_td03'>"+res[i].OPEN_TYPE+"</td>"
                        + "</tr>";
                }
            }
            
            $(".key_list_tb_open tbody").empty();
            $(".key_list_tb_open tbody").append(item);
        }
    });
}
function openListTotal(){
    $.ajax({
        url: "/mysql/mqtt",
        data:{
            xml: "mqtt_open_list_host_total",
            userId: mainUserId,
            userKey: userKey,
            sdate: inOutSdate,
            edate: inOutEdate,
            subUser: subUser
        },success: function(re){
            inOutTotal = re[0].COUNT;
        }
    });
}


function paging(total, size, page){
    

    var pageItem = total / size;
    pageItem = pageItem+(1-(pageItem%1))%1;
    if(pageItem == 0){
        pageItem = 1;
    }
    var pageBlock = 5;
    var pageNum = page;
    if(pageNum == 0){
        pageNum = 1;
    }
    var tmp = total % size;
    var pageCnt = tmp>0 ? ((total-tmp) / size) +1 : total / size;
    var startPage = 1;
    var endPage = startPage+pageBlock - 1;

    if(total < 1){
        endPage = 1;
    }else{
        var bCount = 0;
        if(pageBlock >= pageNum){
            bCount = 1;
        }else{
            tmp = pageBlock - (pageNum % pageBlock);
            if(tmp == pageBlock){
                tmp = 0;
            }
            bCount = (pageNum+tmp) / pageBlock;
        }
        startPage = pageBlock*(bCount -1) +1;
        endPage = startPage + pageBlock - 1;
        if(pageCnt < endPage){
            endPage = pageCnt;
        }
    }
    var prevItem = "";
    var prevData =  startPage == 1 ? 1 : (startPage-1);
    prevItem += "<li data-page='"+prevData+"' id='prev_page_btn' class='numbtn_list_li'>"
            + "<button class='button_num_btn button_num_btn_arr pagebtn_hover_style'>처음 페이지</button>"
            + "</li>";
    var item = "";
    for(var i=startPage; i<=endPage; i++){
        var active = "";
        if(page == i){
            active = "active";
        }
        item += "<li data-page='"+i+"' class='numbtn_list_li'>"
              + "<button class='button_num_btn "+active+" pagebtn_hover_style'>"
              + "<p class='button_02_bold gray_darken_3_font'>"+i+"</p>"
              + "<button>"
              + "</li>";
    }
    var nextItem = "";
    var nextData = endPage == pageCnt ? endPage : (endPage+1);
    nextItem += "<li data-page='"+nextData+"' id='next_page_btn' class='numbtn_list_li'>"
              + "<button class='button_num_btn button_num_btn_arr pagebtn_hover_style'>마지막 페이지</button>"
              + "</li>";
    var totalItem = prevItem+item+nextItem;
    $("#foot_page ul").empty();
    $("#foot_page ul").append(totalItem);
}
$(document).on("click", "#foot_page ul li", function(){
    var page = $(this).attr("data-page");
    var currentpage = page - 1;
    currentpage = currentpage == 0 ? currentpage : currentpage*userPageSize;
    userSelectPage = page;
    userPage = currentpage;

    user_init();
});