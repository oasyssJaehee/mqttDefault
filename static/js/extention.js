
jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();
function Alert(msg){
	var title = null;
	var callback = null;
	
	if(arguments.length>1){
		if($.type(arguments[1])=="function"){
			title=null;
			callback = arguments[1];
		}else{
			title=arguments[1];
		}
	}
	
	jAlert(msg, title, callback);
}
function Confirm(msg, yes, no){ 
	jConfirm(msg, null, function(r){
		if(r) yes();
		else if(no) no();
	}); 
}
function PromptPw(msg, value, title, yes, no){ 
	jPromptPw(msg, value, title, function(r){
		if(r) yes(r);
		else if(no) no();

	}); 
}
function Prompt(msg, value, title, yes, no){ 
	jPrompt(msg, value, title, function(r){
		if(r) yes(r);
		else if(no) no();

	}); 
}
function jqueryLoadingStart () {
// 	    $('#container').loading('start');
	var div = "<div id='custom-overlay' style='display:none;'>"
			+ "<div class='loading-spinner'>"
			+ "Loading (custom)..."
			+ "</div>"
		    + "</div>";
	if(!$("body").hasClass("container")){
		$("body").addClass("container");
	}
	$("body").append(div);
	$('#container').loading({
		overlay: $("#custom-overlay")
	});
}
function jqueryLoadingStop () {
	$('#container').loading('stop');
	$("#container").remove();
	$("body").removeClass("container");
}

$(document).ready(function(){
	setup($("body"));
});

function lastday(){ 
    //년과 월에 따라 마지막 일 구하기 
    var Year=document.getElementsByClassName('select_year')[0].value; 
    var Month=document.getElementsByClassName('select_month')[0].value; 
    var day=new Date(new Date(Year,Month,1)-86400000).getDate(); 
    /* = new Date(new Date(Year,Month,0)).getDate(); */ 
    var dayindex_len=document.getElementsByClassName('select_day')[0].length; 
    if(day>dayindex_len){ 
        for(var i=(dayindex_len+1); i<=day; i++){ 
            document.getElementsByClassName('select_day')[0].options[i-1] = new Option(i, i); 
            $('.select_day_div').append('<li class="date_pop_date_num_li" data-val="'+i+'">'
            +'     <h2 class="">'+i+'</h2>'
            +' </li>'); 
        } 
    } else if(day<dayindex_len){ 
        for(var i=dayindex_len; i>=day; i--){ 
            console.log(i);
            document.getElementsByClassName('select_day')[0].options[i]=null; 
            $('.select_day_div li[data-val="'+(i+1)+'"]').remove();
        } 
    } 
}
function replaceAll(str, searchStr, replaceStr) {
	return str.split(searchStr).join(replaceStr);
 }
 //숫자 앞에 0채우기
function stringZero(width, n){
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
function moneyComma(str) {
	str = String(str);
	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}
function comma(str) {
	str = String(str);
	return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//바이트 계산
function byteLength(str){
	stringByteLength = 0;
	stringByteLength = (function(s,b,i,c){
		for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
		return b
	})(str);
	

	return stringByteLength;
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
            bCount = (Number(pageNum)+Number(tmp)) / pageBlock;
        }
        startPage = pageBlock*(bCount -1) +1;
        endPage = startPage + pageBlock - 1;
        if(pageCnt < endPage){
            endPage = pageCnt;
        }
    }
    var prevItem = "";
    var prevData =  startPage == 1 ? 1 : (startPage-1);
    if(page != prevData){
        prevData = Number(page)-1;
    }
    prevItem += "<a data-page='"+prevData+"' id='prev_page_btn' class='pagebtn prev'></a>";
    
    var item = "";
    for(var i=startPage; i<=endPage; i++){
        var active = "";
        if(page == i){
            active = "active";
        }
        item += "<a data-page='"+i+"' class='pagebtn num "+active+"'>"+i+"</a>";
        
    }
    var nextItem = "";
    var nextData = endPage == pageCnt ? endPage : (endPage+1);
    if(page != nextData){
        nextData = Number(page)+1;
    }
    nextItem += "<a data-page='"+nextData+"' id='next_page_btn' class='pagebtn next'></a>";
    var totalItem = prevItem+item+nextItem;
    $("#foot_page").empty();
    $("#foot_page").append(totalItem);
}
function curDate(sep){

    var today = new Date();   
    var year = today.getFullYear(); 
    var month = today.getMonth() + 1;  
    var date = today.getDate();  
    var day = today.getDay();  
    
    return year + sep + stringZero(2,month) + sep + stringZero(2,date);

}

function addDate(date,sep,flag,addNumber){
    try{
        var date = replaceAll(replaceAll(date,"-",""),".","");
        addNumber = Number(addNumber);
        var parseYear = Number(date.toString().substring(0,4));
        var parseMonth = Number(date.toString().substring(4,6))-1;
        var parseDate = Number(date.toString().substring(6,8));
        var tmpDate = new Date(parseYear, parseMonth, parseDate);
        if(flag == "y"){
            tmpDate.setFullYear(tmpDate.getFullYear()+addNumber);
        }else if(flag == "m"){
            tmpDate.setMonth(tmpDate.getMonth()+addNumber);
        }else if(flag == "d"){
            tmpDate.setDate(tmpDate.getDate()+addNumber);
        }else{
            alert("일자를 구하는데 실패하였습니다.");
            return date;
        }
        // return year + sep + stringZero(2,month) + sep + stringZero(2,date);
        return stringZero(4,tmpDate.getFullYear().toString())+ sep + stringZero(2,(tmpDate.getMonth()+1).toString())+ sep + stringZero(2,tmpDate.getDate().toString());
    }catch(e){
        alert(e);
        return "";
    }
}
//도어락 연결시 시간초 추가
var connectinterver;
function bleConnectClear(){
    clearInterval(connectinterver);
}
function bleConnectTimerText(){
    var count = 21;
    connectinterver = setInterval(function(){
        count--;
        $(".spin-spinning").find(".tips").text("도어락 연결 중입니다..."+"("+count+")");
        if(count == 0){
            clearInterval(connectinterver);
        }
    }, 1000);
}
//앞에 0 제거 추가
function removePad (str) {
    str = str.toString();
    var b = str.replace(/(^0+)/, "");
    return b
}
function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}
//연락처 하이픈 추가
function phoneHipen(str){
    var hi = str.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
  
    return hi;
}
function setup(base){
	$("input.phone").on("keyup", function() {
        $(this).val($(this).val().replace(/[^0-9-]/gi,""));
		var key = event.charCode || event.keyCode || 0;
		$text = $(this);
		if (key !== 8 && key !== 9) {
			if ($text.val().length === 3) {
				$text.val($text.val() + '-');
			}
			if ($text.val().length === 8) {
				$text.val($text.val() + '-');
			}
		}
		if($(this).val().length > 13){
			Alert("올바른 연락처를 입력해 주세요.",function(){
				$(this).focus();
				var str = $text.val();
				$text.val(str.slice(0,-1));
			});
			
		}
		return (key == 8 || key == 9 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));  
	});
    //현관문 비밀번호
    $("input.door_pass").on("keyup", function() {
        $(this).val($(this).val().replace(/[^0-9-]/gi,""));
		var key = event.charCode || event.keyCode || 0;
		$text = $(this);
		if($(this).val().length > 4){
			Alert("비밀번호는 4자리까지 가능 합니다.",function(){
				$(this).focus();
				var str = $text.val();
				$text.val(str.slice(0,-1));
			});
			
		}
		return (key == 8 || key == 9 || key == 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105));  
	});
	$(".not_fun").on("click", function(){
        Alert("준비중 입니다.");
        return;
    });

    $(".date_inp").attr("readonly", true);

    $(".search_inp").on("keyup", function(e){
        if(e.keyCode == 13){
            $(".search_icon").click();
        }
    });
    var now = new Date(); 
    var year = now.getFullYear(); 
    var mon = (now.getMonth() + 1) > 9 ? ''+(now.getMonth() + 1) : '0'+(now.getMonth() + 1); 
    var day = (now.getDate()) > 9 ? ''+(now.getDate()) : '0'+(now.getDate()); 
    for(var i = year ; i <= year+10 ; i++) { 
        $('.select_year_future').append('<option value="' + i + '">' + i + '</option>'); 
        $('.select_year_div_future').append('<li class="date_pop_date_num_li" data-val="'+i+'">'
               +'     <h2 class="">'+i+'</h2>'
               +' </li>'); 
    } 
    for(var i = year-10 ; i <= year+10 ; i++) { 
        $('.select_year_search').append('<option value="' + i + '">' + i + '</option>'); 
        $('.select_year_div_search').append('<li class="date_pop_date_num_li" data-val="'+i+'">'
        +'     <h2 class="">'+i+'</h2>'
        +' </li>'); 
    } 
    for(var i=1; i <= 12; i++) { 
        var mm = i > 9 ? i : "0"+i ; 
        $('.select_month').append('<option value="' + mm + '">' + mm + '</option>'); 
        $('.select_month_div').append('<li class="date_pop_date_num_li" data-val="'+mm+'">'
        +'     <h2 class="">'+mm+'</h2>'
        +' </li>'); 
    } 
    for(var i=1; i <= 31; i++) { 
        var dd = i > 9 ? i : "0"+i ; 
        $('.select_day').append('<option value="' + dd + '">' + dd+ '</option>'); 
        $('.select_day_div').append('<li class="date_pop_date_num_li" data-val="'+dd+'">'
        +'     <h2 class="">'+dd+'</h2>'
        +' </li>'); 
    } 

    $(".select_year > option[value="+year+"]").attr("selected", "true"); 
    $(".select_month > option[value="+mon+"]").attr("selected", "true"); 
    $(".select_day > option[value="+day+"]").attr("selected", "true");
    $(".select_year_div > li[data-val="+year+"]").addClass("active"); 
    $(".select_month_div > li[data-val="+mon+"]").addClass("active"); 
    $(".select_day_div > li[data-val="+day+"]").addClass("active");
    $(".select_year").on("change",function(){
        var val = $(".select_year").val();
        lastday();
        $(".select_year_div li").removeClass("active");
        $(".select_year_div > li[data-val="+val+"]").addClass("active");
        if($(".select_year_div > li[data-val="+val+"]").length>0){
            $(".select_year_div > li[data-val="+val+"]")[0].scrollIntoView({block: "center"});
        }
        // setTimeout(function() {
        $(".select_day").change();
        // }, 100);
    });
    $(".select_month").on("change",function(){
        var val = $(".select_month").val();
        lastday();
        $(".select_month_div li").removeClass("active");
        $(".select_month_div > li[data-val="+val+"]").addClass("active");
        if($(".select_month_div > li[data-val="+val+"]").length>0){
            $(".select_month_div > li[data-val="+val+"]")[0].scrollIntoView({block: "center"});
        }
        // setTimeout(function() {
        $(".select_day").change();
        // }, 100);
    });
    $(".select_day").on("change",function(){
        var val = $(".select_day").val();
        $(".select_day_div li").removeClass("active");
        $(".select_day_div > li[data-val="+val+"]").addClass("active");
        // setTimeout(function() {
        if($(".select_day_div > li[data-val="+val+"]").length>0){
            $(".select_day_div > li[data-val="+val+"]")[0].scrollIntoView({block: "center"});
        }
        // }, 100);
    });
    $(".select_year_div").on("click","li",function(){
        var val = $(this).data("val");
        $(".select_year").val(val);
        $(".select_year").change();
    });
    $(".select_month_div").on("click","li",function(){
        var val = $(this).data("val");
        console.log(val);
        $(".select_month").val(val);
        $(".select_month").change();
    });
    $(".select_day_div").on("click","li",function(){
        var val = $(this).data("val");
        $(".select_day").val(val);
        $(".select_day").change();
    });
    $(".top_close_btn").on("click",function(){
        $(".date_pop_box").hide();
        $("#dateEmpty").show();
        $("#dateEdate").show();
        $("#dateCorrect").hide();
        $(".date_pop_tit").text("날짜 선택");
    });
    
    $(".inp_period").on("click",function(){
        $(".date_pop_box").show();
        $("#dateEmpty").show();
        $("#dateEdate").show();
        $("#dateCorrect").hide();
        $(".date_pop_tit").text("시작날짜 선택");
        $("#datesss").show();
        $("#datesss1").text('');
        $("#datesss2").text('');
        $("#dateValue").val('');
        $(".select_year").change();
        $(".select_month").change();
    });
    $(".inp_date").on("click",function(){
        $(".date_pop_box").show();
        $("#dateEmpty").hide();
        $("#dateEdate").hide();
        $("#dateCorrect").show();
        $(".date_pop_tit").text("날짜 선택");
        $("#datesss").hide();
        $("#dateValue").val('');
        $(".select_year").change();
        $(".select_month").change();
    });
    $("#dateEdate").on("click",function(){
        var val =$(".select_year").val()+"-"+$(".select_month").val()+"-"+$(".select_day").val();
        $(".date_pop_tit").text("종료날짜 선택");
        $("#dateValue").val(val);
        $("#datesss1").text(val);
        $("#dateEdate").hide();
        $("#dateCorrect").show();
    });
    $("#dateCorrect").on("click",function(){
        var sdate = $("#dateValue").val();
        var edate = $(".select_year").val()+"-"+$(".select_month").val()+"-"+$(".select_day").val();

        if(sdate){
            if(replaceAll(replaceAll(sdate,"-","")," ~ ","") > replaceAll(edate,"-","")){
                var tmp = sdate;
                sdate = edate;
                edate = tmp;
            }
            $("#dateValue").val(sdate + " ~ " + edate);
        }else{
            $("#dateValue").val(edate);
        }
        $("#datesss1").text(sdate);
        $("#datesss2").text(edate);
        $(".date_inp").val($("#dateValue").val());
        $(".date_pop_box").hide();
    });
    $("#dateEmpty").on("click",function(){
        $(".date_inp").val("");
        var today = new Date();   
        var year = today.getFullYear(); 
        var month = today.getMonth() + 1;  
        var date = today.getDate();  
        $(".select_year").val(year);
        $(".select_month").val(stringZero(2,month));
        $(".select_day").val(stringZero(2,date));
        $("#datesss1").text('');
        $("#datesss2").text('');
        $("#dateValue").val('');
        $(".date_pop_box").hide();
    });
    $(".select_year").change();
}

