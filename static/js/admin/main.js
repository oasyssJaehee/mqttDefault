function init(){
    $.ajax({
        url:"/mysql/room",
        data:{
            xml:"room_main_list"
        },success:function(res){
            var item ="";
            for(var i=0;i<res.length;i++){
                var stateStr = "";
                var stateClass = "";
                var userKey="off";
                var maidKey="off";
                var masterKey="off";
                if(res[i].ROOM_CODE_STATU == "0030001"){
                    stateStr = "체크인";
                    stateClass = "js";
                }else if(res[i].ROOM_CODE_STATU == "0030005"){
                    stateStr = "청소 요청";
                    stateClass = "cl";
                }else{
                    stateStr = "공실";
                    stateClass = "gs";
                }
                if(res[i].BRIDGE_TRAN_RSPK != ''){
                    userKey = "on"
                }
                if(res[i].ROOM_PASS_CLEANER != ''){
                    maidKey = "on"
                }
                if(res[i].ROOM_PASS_MASTER != ''){
                    masterKey = "on"
                }
                item += "<li class='view_grp_list "+stateClass+" on'>"
                      + "<div class='view_tbox view_tbox01'>"
                      + "<div class='room_state_box'>"
                      + "<span class='room_state "+stateClass+"'>"+stateStr+"</span>"
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
                      + "<div class='view_tbox view_tbox02' style='display:none;'>"
                      + "<h2 class='view_tit view_tit03'>사용기간</h2>"
                      + "<p class='view_txt view_txt02'>08.22 ~ 08.23</p>"
                      + "</div>"
                      + "</li>";
            }
            $(".view_grp_listbox").empty();
            $(".view_grp_listbox").append(item);

        }

    });
}