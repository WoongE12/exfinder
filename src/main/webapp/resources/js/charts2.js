// 날짜를 문자열로 포맷팅하는 함수
function formatDate(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1
    var day = ('0' + date.getDate()).slice(-2); // 일자는 2자리로 맞추기
    return year + '/' + month + '/' + day;
}

// 오늘 날짜를 가져옴
var today = new Date();
var formattedDate = formatDate(today);


// Google Charts 라이브러리 로드
google.charts.load('current', {
	'packages' : [ 'corechart' ]
});

$(document).ready(function() {
	
    // Google Charts 라이브러리가 로드된 후 차트 그리기
    google.charts.setOnLoadCallback(function() {
        //console.log('Google Charts 라이브러리 로드 완료');
    });
    
	fetchExchangeRateData('USD', formattedDate, 'value_USD');
	fetchExchangeRateData('JPY', formattedDate, 'value_JPY');
	fetchExchangeRateData('EUR', formattedDate, 'value_EUR');
	fetchExchangeRateData('CNY', formattedDate, 'value_CNY');
	fetchExchangeRateData('GBP', formattedDate, 'value_GBP');
	fetchExchangeRateData('CHF', formattedDate, 'value_CHF');
	fetchExchangeRateData('INR', formattedDate, 'value_INR');
	fetchExchangeRateData('AUD', formattedDate, 'value_AUD');
	fetchExchangeRateData('SAR', formattedDate, 'value_SAR');
	fetchExchangeRateData('RUB', formattedDate, 'value_RUB');
	
	fetchExchangeRateData('CAD', formattedDate, 'value_CAD');
	fetchExchangeRateData('HKD', formattedDate, 'value_HKD');
	fetchExchangeRateData('EGP', formattedDate, 'value_EGP');
	fetchExchangeRateData('THB', formattedDate, 'value_THB');
	fetchExchangeRateData('VND', formattedDate, 'value_VND');
	fetchExchangeRateData('ZAR', formattedDate, 'value_ZAR');
	fetchExchangeRateData('MXN', formattedDate, 'value_MXN');
	fetchExchangeRateData('BRL', formattedDate, 'value_BRL');
	fetchExchangeRateData('ILS', formattedDate, 'value_ILS');
	fetchExchangeRateData('NZD', formattedDate, 'value_NZD');
});
// '2024/09/06'

function ajaxData(c_code, chartDivId) {
	
	var rate_date = formattedDate; // 필요한 값으로 수정
	// var start_date = '2024/08/01'; // 필요한 값으로 수정
	// var end_date = formattedDate; // 필요한 값으로 수정

	$.ajax({
		type : "POST",
		url : "/ex/charts/graph", // contextPath 사용 "${pageContext.request.contextPath}/charts/graph",
		data : {
			c_code : c_code,
			rate_date : rate_date
			// start_date : start_date,
			// end_date : end_date
		},
		dataType : "json", // Expect JSON response
		success : function(response) {
			//console.log('응답 데이터 확인 ');
			//console.log(response); // 응답 데이터 확인
			//drawCharts(response, chartDivId); // 차트 그리기 함수 호출
			drawTimeCharts(response, chartDivId);
		},
		error : function(xhr, status, error) {
			console.error("AJAX 요청 오류:", status, error);
		}
	});
}

//차트 그리기 함수
function drawTimeCharts(data, chartDivId) {
    if (typeof google === 'undefined' || !google.visualization || typeof google.visualization.DataTable !== 'function') {
        console.error("Google Charts 라이브러리가 로드되지 않았습니다. 재시도합니다.");
        setTimeout(function() {
            drawTimeCharts(data, chartDivId);
        }, 1000);
        return;
    }

    var chartData = new google.visualization.DataTable();
    chartData.addColumn('timeofday', '시간'); // 첫 번째 열: 시간 (시간, 분, 초)
    chartData.addColumn('number', '값'); // 두 번째 열: 값

    // 응답 데이터를 [시간, 값] 형식으로 변환
    var formattedData = data.map(function(item) {
        // annoTime을 [hours, minutes] 형식으로 변환
        var timeParts = item.annoTime.split(':');
        var hours = parseInt(timeParts[0], 10);
        var minutes = parseInt(timeParts[1], 10);
        var time = [hours, minutes, 0]; // seconds는 0으로 설정
        return [time, item.deal_bas_r]; // [시간, 값] 형식으로 배열 반환
    });

    chartData.addRows(formattedData); // DataTable에 데이터 추가

    var options = {
        hAxis: {
            format: 'HH:mm', // 시간 형식 지정
            gridlines: {
                count: -1
            },
            viewWindowMode: 'maximized'
        },
        vAxis: {
            logScale: false
        },
        colors: ['#a52714'],
        legend: {
            position: 'none'
        }
    };
    
    var chart = new google.visualization.LineChart(document.getElementById(chartDivId));
    chart.draw(chartData, options);
}

// 정보 함수
function fetchExchangeRateData(c_code, rate_date, div_id) {
    $.ajax({
        url: '/ex/charts/value',
        type: 'POST',
        data: {
            c_code: c_code,
            rate_date: rate_date
        },
        success: function(response) {
            // console.log('서버 응답:', response); // 서버 응답 확인

            // 응답 데이터가 JSON 객체로 가정
            const today_base_r = response.today_base_r;
            const yesterday_base_r = response.yesterday_base_r;
            const difference = response.difference;
            const percent = response.percent;

            // 결과 문자열 생성
            let result;
            

            if (today_base_r > yesterday_base_r) {
                result = today_base_r + ' ▲' + difference.toFixed(2) + ' +' + percent.toFixed(2) + '%';
                
                
            } else if (today_base_r === yesterday_base_r) {
                result = today_base_r + ' -' + difference.toFixed(2) + ' ' + percent.toFixed(2) + '%';
                
                
            } else {
                result = today_base_r + ' ▼' + difference.toFixed(2) + ' ' + percent.toFixed(2) + '%';
                        
            }

            //console.log('결과 문자열:', result); // 결과 문자열 확인

            // HTML 콘텐츠 업데이트
            const htmlContent = '<div>' + result + '</div>';
            //console.log('업데이트할 HTML:', htmlContent); // 업데이트할 HTML 확인
            

            // HTML 업데이트
            $('#' + div_id).html(htmlContent);
            

            // 업데이트 후 상태 확인
            //console.log('업데이트된 HTML:', $('#' + div_id).html());
        },
        error: function(xhr, status, error) {
            console.error(c_code,'에 대한 데이터를 가져오는 데 실패했습니다:', error);
            $('#' + div_id).html('<div>데이터를 가져오는 데 실패했습니다.</div>');
        }
    });
}

$(document).ready(function() {
    $('#currency').change(function() {
        // 선택된 통화의 차트 ID
        var selectedCurrency = $(this).val();
        
        // 모든 차트 숨기기
        $('.chart_graph_box_container').hide();

        // 선택한 통화의 차트 보이기
        if (selectedCurrency) {
            $('#' + selectedCurrency + '-chart').show();
        	ajaxData('USD', 'chart_USD'); 
        	ajaxData('JPY', 'chart_JPY'); 
        	ajaxData('EUR', 'chart_EUR');
        	ajaxData('CNY', 'chart_CNY');
        	ajaxData('GBP', 'chart_GBP');
        	ajaxData('CHF', 'chart_CHF');
        	ajaxData('INR', 'chart_INR');
        	ajaxData('AUD', 'chart_AUD');
        	ajaxData('SAR', 'chart_SAR');
        	ajaxData('RUB', 'chart_RUB');

        	ajaxData('CAD', 'chart_CAD'); 
        	ajaxData('HKD', 'chart_HKD'); 
        	ajaxData('EGP', 'chart_EGP');
        	ajaxData('THB', 'chart_THB');
        	ajaxData('VND', 'chart_VND');
        	ajaxData('ZAR', 'chart_ZAR');
        	ajaxData('MXN', 'chart_MXN');
        	ajaxData('BRL', 'chart_BRL');
        	ajaxData('ILS', 'chart_ILS');
        	ajaxData('NZD', 'chart_NZD');
        }
    });
});