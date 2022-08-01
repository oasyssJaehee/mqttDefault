function nowDate(){
    var now = new Date();

    

    var monthArr = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
    var monthItem = "";
    console.log(monthArr.length);
    for(var i=0;i<monthArr.length; i++){
        monthItem += "<option value='"+(i+1)+"'>"+monthArr[i]+"</option>"
    }

    $("input[name='div_input']").val(now.getFullYear());
    $("select[name='div_select']").append(monthItem);

    $("input[name='as_input']").val(now.getFullYear());
    $("select[name='as_select']").append(monthItem);

    $("input[name='dd_input']").val(now.getFullYear());
    $("select[name='dd_select']").append(monthItem);

}
function notice(){
    $.ajax({
        url: "/mysql/common",
        data:{
            xml: "select_notice_list",
            sdate: "",
            edate: "",
            type: "0080001",
            import: "",
            keyWord: "",
            page: "0",
            pageSize: "5"
        },success: function(res){
            console.log(res);
            var item = "";
            if(res.length > 0){
                for(var i=0; i<res.length; i++){
                    var importDiv = "";
                    if(res[i].NOTICE_IMPORT == "0070001"){
                        importDiv = "<span class='notice_list_tbox_state notice_list_tbox_state01'>보통</span>"
                    }else if(res[i].NOTICE_IMPORT == "0070002"){
                        importDiv = "<span class='notice_list_tbox_state notice_list_tbox_state02'>중요</span>"
                    }else if(res[i].NOTICE_IMPORT == "0070003"){
                        importDiv = "<span class='notice_list_tbox_state notice_list_tbox_state03'>긴급</span>"
                    }

                    item += "<li class='notice_list_tbox' data-noticeKey='"+res[i].NOTICE_KEY+"'>"
                          + "<div class='notice_list_tbox01'>"
                          + importDiv
                          + "<h2 class='notice_list_tbox_tit'>"+res[i].NOTICE_TITLE+"</h2>"
                          + "</div>"
                          + "<div class='notice_list_tbox02'>"
                          + "<p class='notice_list_tbox_date'>"+res[i].NOTICE_FDATE+"</p>"
                          + "</div>"
                          + "</li>";
                }
                
            }else{
                item += "<li class='notice_list_tbox notice_list_tbox_none'>"
                      + "<p class='notice_list_tbox_none_txt'>조회된 자료가 없습니다.</p>"
                      + "</li>";
            }
            $(".notice_list_grp").append(item);
        }
    });
}
var backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)'
  ];
var borderColor = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ];
var backGroundArray = new Array();
var borderColorArray = new Array();
function roomChart(){
    $.ajax({
        url:"/mysql/room",
        data:{
            xml: "room_user_chart"
        }, success: function(res){
            console.log(res);
            
            var labelArray = new Array();
            var dataArray = new Array();
            for(var i=0; i<res.length; i++){
                labelArray.push(res[i].CODE_CONTENT);
                dataArray.push(res[i].COUNT);

                backGroundArray.push(backgroundColor[i]);
                borderColorArray.push(borderColor[i]);
            }
            
            const data = {
                labels: labelArray,
                datasets: [{
                  label: 'Count',
                  data: dataArray,
                  backgroundColor: borderColorArray,
	              hoverBackgroundColor: backGroundArray,
                  borderWidth: 1
                }]
            };
            const config = {
                type: 'bar',
                data: data,
                options: {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                          display: false
                        }
                    }
                }
            };
            const myChart = new Chart(document.getElementById('roomChart').getContext("2d"),config);
        }
    });
}
var divChartCanvas;
function divChart(refresh){
    
    var year = $("input[name='div_input']").val()+"-01-01";
    var month = "";
    if($("select[name='div_select']").val() != ""){
        month = $("input[name='div_input']").val()+"-"+$("select[name='div_select']").val()+"-01";
    }
    if(refresh){
        divChartCanvas.destroy();
    }
    $.ajax({
        url:"/mysql/room",
        data:{
            xml: "as_type_chart",
            year: year,
            month: month
        }, success: function(res){
            console.log(res);
            var labelArray = new Array();
            var dataArray = new Array();
            for(var i=0; i<res.length; i++){
                labelArray.push(res[i].CODE_CONTENT);
                dataArray.push(res[i].COUNT);

                backGroundArray.push(backgroundColor[i]);
                borderColorArray.push(borderColor[i]);
            }
            
            const data = {
                labels: labelArray,
                datasets: [{
                  label: 'Count',
                  data: dataArray,
                  backgroundColor: borderColorArray,
	              hoverBackgroundColor: backGroundArray,
                  borderWidth: 1
                }]
            };
            const config = {
                type: 'polarArea',
                data: data,
                options: {
                    maintainAspectRatio: false,
                    responsive: true
                }
            };
            divChartCanvas = new Chart(document.getElementById('as_type_chart').getContext("2d"),config);
            
        }
    });
}
var statusChartCanvas;
function statusChart(refresh){
    var year = $("input[name='as_input']").val()+"-01-01";
    var month = "";
    if($("select[name='as_select']").val() != ""){
        month = $("input[name='as_input']").val()+"-"+$("select[name='as_select']").val()+"-01";
    }
    if(refresh){
        statusChartCanvas.destroy();
    }
    $.ajax({
        url:"/mysql/room",
        data:{
            xml: "as_status_chart",
            year: year,
            month: month
        }, success: function(res){
            
            var labelArray = new Array();
            var dataArray = new Array();
            for(var i=0; i<res.length; i++){
                labelArray.push(res[i].CODE_CONTENT);
                dataArray.push(res[i].COUNT);

                backGroundArray.push(backgroundColor[i]);
                borderColorArray.push(borderColor[i]);
            }
            
            const data = {
                labels: labelArray,
                datasets: [{
                  data: dataArray,
                  backgroundColor: borderColorArray,
	              hoverBackgroundColor: backGroundArray
                }]
            };
            const config = {
                plugins: [ChartDataLabels],
                type: 'pie',
                data: data,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 20,
                        boxWidth: 10
                      }
                    },
                    plugins: {
                      datalabels: {
                        formatter: (value, ctx) => {
                          let sum = 0;
                          let dataArr = ctx.chart.data.datasets[0].data;
                          dataArr.map(data => {
                            sum += data;
                          });
                          let percentage = (value * 100 / sum).toFixed(2) + "%";
                          return percentage;
                        },
                        color: 'white',
                        labels: {
                          title: {
                            font: {
                              size: '16'
                            }
                          }
                        }
                      }
                    }
                  }
            };
            statusChartCanvas = new Chart(document.getElementById('as_status_chart').getContext("2d"),config);
        }
    });
}
var ddChartCanvas;
function ddChart(refresh){
    var year = $("input[name='dd_input']").val()+"-01-01";
    var month = "";
    if($("select[name='dd_select']").val() != ""){
        month = $("input[name='dd_input']").val()+"-"+$("select[name='dd_select']").val()+"-01";
    }
    if(refresh){
        ddChartCanvas.destroy();
    }
    
    $.ajax({
        url:"/mysql/room",
        data:{
            xml: "dd_as_chart",
            year: year,
            month: month
        }, success: function(res){
            
            var labelArray = new Array();
            var dataArray = new Array();
            for(var i=0; i<res.length; i++){
                labelArray.push(res[i].ADMIN_NAME);
                dataArray.push(res[i].COUNT);

                backGroundArray.push(backgroundColor[i]);
                borderColorArray.push(borderColor[i]);
            }
            
            const data = {
                labels: labelArray,
                datasets: [{
                  data: dataArray,
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            };
            const config = {
                type: 'line',
                data: data,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: {
                          display: false
                        }
                    }
                }
            };
            ddChartCanvas = new Chart(document.getElementById('dd_chart').getContext("2d"),config);
            $.loading.end();
        }
    });
}