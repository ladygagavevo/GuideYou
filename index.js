function initialize() {

     document.addEventListener('deviceready', onDeviceReady, false);
  }
function redirect(){
  window.location.href = "http://stackoverflow.com";
}
function onDeviceReady() {
	alert("目前距離五米內");
    var paramsObj = {
        request : true,
        statusReceiver : true,
        restoreKey : "bluetoohleplugin"
    };

    // onSuccess是callback function， paramsObj是設定的一些參數，詳情可以去看API
    bluetoothle.initialize(onSuccess, paramsObj);

}
var count=0;
var counnt=0;

function stop(){
//  alert("here");
  count=101;
//  bluetoothle.stopScan(stopScanSuccess, stopScanError);

  alert(count);
}



function onSuccess(obj) {
    var paramsObj = {services:[]};
	alert("目");


    // 開始偵測


    bluetoothle.startScan(function(obj){
        if(obj.status == "scanResult"&&count<100){

            // rssi轉換成距離(公式中的一些常數不同情況用得會不一樣，可自行上網找)
            var rssi = obj.rssi;
            var power = (Math.abs(rssi)-59)/(10*4.0);
            var ans = Math.pow(10, power).toFixed(2);

            var address = obj.address;

            // iBeacon advertisement 的 data structure:
            // https://support.kontakt.io/hc/en-gb/articles/201492492-iBeacon-advertising-packet-structure
            var ad = bluetoothle.encodedStringToBytes(obj.advertisement);
            var uuid = '';
            var major = '';
            var minor = '';
            for(var i = 9; i < 25; i++){
                if(ad[i] < 16)
                    uuid += '0';
                uuid += ad[i].toString(16);
                if(i == 16)
                     uuid += '<br>'
                if(i == 12 || i == 14 || i == 16 || i == 18)
                     uuid += '-';
            }
            for(var i = 25; i < 27; i++){
                if(ad[i] < 16)
                    major += '0';
                major += ad[i].toString(16);
            }
            for(var i = 27; i < 29; i++){
                if(ad[i] < 16)
                    minor += '0';
                minor += ad[i].toString(16);
            }
            //  $("#app").append(count + '<br>');
             //$("#app").append(address + ', ' + count + time() + '<br>');
            if (address=="D0:B5:C2:8F:5D:E9")
            {
              count=0;
              //counnt=1;
              // $("#app").append("Gotcha!!" + '<br>');
            }else{count++;}
			if(count==1){
				alert("目前距離五米內");
			}
             if(count==100){  //catchBT();
                alert("YOU ARE LOST");
									bluetoothle.stopScan(stopScanSuccess, stopScanError);
                $("#app").append('<a  href="memberDistance.html" class="button button-border-set button-rounded" onclick="javascript:redirect();">Open the MAP</a>');
                $("#app").append('<a  href="mem.html" class="button button-border-set button-rounded"onclick="javascript:redirect();">Talk to the guide</a>');
                firebase.database().ref('company/tourment_4/people/customers/1/lost/').set({
              lost: 1
            });
             }

            }
            if(count==101){
              bluetoothle.stopScan(stopScanSuccess, stopScanError);

            }
        }
, function(obj){
      bluetoothle.stopScan(stopScanSuccess, stopScanError);
    }, paramsObj);
}




function stopScanSuccess(obj)
    {
         if (obj.status == "scanStopped")
         {
              alert("Scan was stopped successfully");
         }
        else
        {
             alert("Unexpected stop scan status: " + obj.status);
        }
    }

    function stopScanError(obj)
    {
      alert("Stop scan error: " + obj.error + " - " + obj.message);
    }







function time() {
    date = new Date();
     year = date.getYear() + 1900;
     month = "" + (date.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
     day = "" + date.getDate(); if (day.length == 1) { day = "0" + day; }
     hour = "" + date.getHours(); if (hour.length == 1) { hour = "0" + hour; }
     minute = "" + date.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
     second = "" + date.getSeconds(); if (second.length == 1) { second = "0" + second; }
     return month + "/" + day + " " + hour + ":" + minute + ":" + second;
 }
 //
 // function catchBT(){
 //   //var group = address;
 //    if (counnt==1){
 //      $("#app").append("Gotcha!!" + '<br>');
 //    }else {
 //      $("#app").append("not here" + '<br>');}
 // }
initialize();// 執行initialize function
