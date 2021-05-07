function showClock(){
  now = new Date();
  hours = now.getHours();
  minutes = now.getMinutes();
  seconds = now.getSeconds();
  timeValue = (hours >= 12) ? "下午 " : "上午 ";
  timeValue += ((hours > 12) ? hours - 12 : hours) + " 點";
  timeValue += ((minutes < 10) ? " 0" : " ") + minutes + " 分";
  timeValue += ((seconds < 10) ? " 0" : " ") + seconds + " 秒";
  document.getElementById('clock').innerHTML = "<b>目前時間:</b>"+timeValue+"<br>";
  //console.log('now hour is:'+hours+'min is: '+minutes);
  setTimeout("showClock()",1000);
}

function setMeetTime(num){
  var time = document.getElementById('setMeetTime').value;
  
  //取得集合小時 分鐘
  h = time.slice(0,2); //returns "exce"
  m = time.slice(3,5); //returns "ce"
  //換成可以計算的方式-集合
  H=h*60;
  M=m*1;
  meetH=h*1;
  console.log(h+','+m);
  //判斷將集合時間寫入meettime
  //計算剩餘時間
  now = new Date();
  HOURS=(now.getHours())*60;
  MINUTES=(now.getMinutes())*1;
  totalM = (meetH)*60+M-HOURS-MINUTES;
    
  rm=totalM%60;
  //如果超過時間，totalM<0，H會有負數
  if(totalM>0){
    rh=Math.floor(totalM/60);
	firebase.database().ref('company/tourment_4/meettime/'+num).set({
      del: 0,
      meetHour: meetH,
      meetMin: M
    });
    //alert('set time ok');
    swal("confirm", "集合資訊已設定", "success");
    //console.log('meet time is: ('+posTime.meetHour+","+posTime.meetMin+")"); 
    meettimeValue = (meetH >= 12) ? "下午 " : "上午 ";
    meettimeValue += ((meetH > 12) ? meetH - 12 : meetH) + " 點";
    meettimeValue += ((M < 10) ? " 0" : " ") + M + " 分";
    getMeetReserveTime();
  
  } else{
    //alert('設定時間超過，請重新設定');
    swal({
      title: "failed",
      text: "設定時間超過，請重新設定"
    });
    
  }
}
function getMeetReserveTime(){
  //從firebase找集合時間
  var timeRef = firebase.database().ref("company/tourment_4/meettime/now");
  timeRef.once('value').then(function(snapshot) {
    posTime = {
      meetHour: snapshot.val().meetHour,
      meetMin: snapshot.val().meetMin
    };
    console.log('postime:'+posTime);

    if (typeof posTime !== 'undefined') {
    //console.log('meet time is: ('+posTime.meetHour+","+posTime.meetMin+")"); 
    meettimeValue = (posTime.meetHour >= 12) ? "下午 " : "上午 ";
    meettimeValue += ((posTime.meetHour > 12) ? posTime.meetHour - 12 : posTime.meetHour) + " 點";
    meettimeValue += ((posTime.meetMin < 10) ? " 0" : " ") + posTime.meetMin + " 分";

    //如果在導遊端有抓到setMeetTime-->寫入已有的集合時間
    if(document.getElementById('now_time')){
      console.log('yes now_time');
      if(posTime.meetHour<10){
        if(posTime.meetMin<10){
          document.getElementById('now_time').innerHTML='<b>集合時間:</b>'+'0'+posTime.meetHour+':0'+posTime.meetMin+':00';
        }else{
          document.getElementById('now_time').innerHTML='<b>集合時間:</b>'+'0'+posTime.meetHour+':'+posTime.meetMin+':00';
        }
      }else{
        if(posTime.meetMin<10){
          document.getElementById('now_time').innerHTML='<b>集合時間:</b>'+posTime.meetHour+':0'+posTime.meetMin+':00';
        }else{
          document.getElementById('now_time').innerHTML='<b>集合時間:</b>'+posTime.meetHour+':'+posTime.meetMin+':00';
        }
      }
    }  
    
    //計算剩餘時間
    now = new Date();
    HOURS=(now.getHours())*60;
    MINUTES=(now.getMinutes())*1;
    totalM = (posTime.meetHour)*60+posTime.meetMin-HOURS-MINUTES;
    console.log('past a minute');

    firebase.database().ref('company/tourment_4/meettime/now/reTime').set(totalM);
    firebase.database().ref('company/tourment_4/people/customers/1/reserve/time/time').set(totalM);

    //如果再MEMBER端，會有提醒
    if(document.getElementById('remind')){
      console.log('has remind');
      console.log(totalM);   
      
      switch(totalM){
        case 59:
        console.log('剩下一小時!');
        cordova.plugins.notification.local.schedule({
          title: '集合提醒',
          text: '剩下一小時',
          foreground: true
        });
        break;
        case 30:
        cordova.plugins.notification.local.schedule({
          title: '集合提醒',
          text: '剩下半小時',
          foreground: true
        });
        console.log('剩下半小時!');
        break;
        case 10:
        cordova.plugins.notification.local.schedule({
          title: '集合提醒',
          text: '剩下10分鐘',
          foreground: true
        });
        console.log('剩下10分鐘!');
        break;
      }
      //若剩餘時間=0 集合時間=null
      if(totalM>0){
        rm=totalM%60;
        //如果超過時間，totalM<0，H會有負數
        rh=Math.floor(totalM/60);
        document.getElementById('reserveTime').innerHTML ='<b>剩餘時間:</b>'+rh+'hr '+rm+'min<br>';
        setTimeout("getMeetReserveTime()",60000);
      }else{
        //把now歸零
        firebase.database().ref('company/tourment_4/meettime/now/').set({
          meetHour: 0,
          meetMin: 0,
          reTime: 0
        });
        document.getElementById('reserveTime').innerHTML ='<b>剩餘時間:</b>'+rh+'hr '+rm+'min<br>';
      }
    }
  }
  // 但若recArray陣列最後一筆還是不存在(undefined)就再延遲0.1秒再試試看囉
  else{ 
    setTimeout(function(){getMeetTimeout();}, 100);
  }
  //document.getElementById("msg").innerHTML += '<b>集合時間:</b>'+snapshot.val().meetHour+'hr '+snapshot.val().meetMin+'min<br>'
  });
  }


