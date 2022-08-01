function popReset(){
    $("#pop_user_div").css("display", "block");
    $("#pop_addr_div").css("display", "none");
    $(".pop_tab_listbox li").removeClass("active");
    $(".pop_tab_listbox li").eq(0).addClass("active");
    $(".block_cont_none_list").css("display", "block");
    $(".block_cont_click").css("display", "none");
    $("input[name='pop_user_name']").val('');
    $("input[name='pop_user_tel']").val('');
    $("input[name='pop_user_id']").val('');
    $("input[name='pop_user_id']").attr("readonly", false);

}
//메인유저 정보
var mainUserId = "";
var mainUser = "";
function popUserInfo(){
    $.ajax({
        url: "/mysql/user",
        data:{
            xml: "admin_select",
            adminKey: adminKey
        }, success:function(data){
            mainUser = data[0].ADMIN_NAME;
            mainUserId = data[0].ADMIN_ID;
            $("input[name='pop_user_name']").val(data[0].ADMIN_NAME);
            $("input[name='pop_user_tel']").val(data[0].ADMIN_TEL);
            $("input[name='pop_user_id']").val(data[0].ADMIN_ID);
            $("input[name='pop_user_addr1']").val(data[0].ADMIN_ADDR1);
            $("input[name='pop_user_addr2']").val(data[0].ADMIN_ADDR2);
            $("select[name='pop_user_use']").val(data[0].ADMIN_USE);
            var edate = data[0].ADMIN_EDATE;
            if(edate.length==8){
                edate = edate.substring(0,4)+"-"+edate.substring(4,6)+"-"+edate.substring(6,8);
            }
            $("input[name='pop_user_edate']").val(edate);
            $("select[name='pop_user_level']").val(data[0].ADMIN_LEVEL);
            $("select[name='pop_user_level']").change();

            $("input[name='pop_user_id']").attr("readonly", true);
            if(data[0].ADMIN_IMGNAME != null){
                var path = data[0].ADMIN_IMGPATH;
                var imgName = data[0].ADMIN_IMGNAME;
                $("#user_img").css("background-image", "url("+path+imgName+")");
                // var userImg = "<img style='margin:0;width:100%; height:100%; border-radius:20px !important;' src='"+path+imgName+"' class='rounded float-left' alt=''></img>";
                // $("#user_img").append(userImg);
            }
        }
    });
    
}
var inOutTotal=0;
var inOutPage = 0;
var inOutPageSize = 20;
var inOutTimer;
var inOutSdate = "";
var inOutEdate = "";
var subUser = "";


function addrList(hotelCode){
    // $.ajax({
    //     url: "/mysql/common",
    //     data:{
    //         xml : "codeList",
    //         cod: "003"
    //     }, success:function(res){
    //         var item="";
    //         if(res.length > 0){
    //             for(var i=0; i<res.length; i++){
    //                 item+="<option value="+res[i].CODE_CODE+">"+res[i].CODE_CONTENT+"</option>"
    //             }
    //             $("select[name='search_dcod']").append(item);
    //         }
            
    //     }
    // })
    $.ajax({
        url:"/mysql/common",
        data:{
            xml: "codeList",
            cod: "003"
            

        },success: function(res){
            var item="";
            console.log(res);
            if(res.length == 0){
                item = "<td colspan='2' class='key_list_td key_list_td_none'>조회내역이 없습니다.</td>";
            }else{
                for(var i=0; i<res.length; i++){
					
                    item += "<tr></tr><td class='key_list_td key_list_td02'>"+res[i].CODE_CONTENT+"</td>  "+
                    "<td class='key_list_td key_list_td02'>  "+
                    "    <input style='display:none;' type='checkbox' class='ck ck_addr' id='code_"+i+"' data-addr='"+res[i].CODE_CODE+"'>  "+
                    "    <label class='dis_inblock ck_btn' for='code_"+i+"'></label>  "+
                    "</td></tr>	  ";
                }
            }
            
            $(".key_list_tb_addr tbody").empty();
            $(".key_list_tb_addr tbody").append(item);
        }
    });
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
                    $("[data-addr='"+res[i].USER_ADDR+"']").click();
                }
            }
            
        }
    });
}
function addrSave(){
    
    $.ajax({
        url:"/mysql/mqtt",
        data:{
            xml: "addr_delete",
            userID: mainUserId

        },success: function(res){
            console.log(res);
            var addrs = $('.ck_addr:checked');
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
                        Alert("저장되었습니다.");
                    }
                });
            }
                
            
            
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