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
    bluetoothle.initialize(stopScanSuccess, paramsObj);

}

var count=0;
var counnt=0;





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
