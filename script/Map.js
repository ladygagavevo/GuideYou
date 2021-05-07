//當使用者按一下地圖時在點選的位置建立一個標記
  function placeMarkerAndPanTo(latLng,map){
  	//先移除舊的標記
  	meetlocation.setMap(null);
  	//Animation.DROP讓他可以有慢移的感覺
  	meetlocation = new google.maps.Marker({
    position: latLng,
    animation: google.maps.Animation.DROP,
    map: map
    });
    map.panTo(latLng);
    //document.getElementById("myPosition").innerHTML = "<b>點一下</b>: " + latLng + "<br>";
    lat2address(meetlocation);

  }

  function setMeetplace(num){
  	//將集合地點寫入meetlocation
	var ad = document.getElementById("address").value;
    firebase.database().ref('company/tourment_4/meetlocation/'+num).set({
      del: 0,
    	meetLat: meetlocation.getPosition().lat(),
    	meetLng: meetlocation.getPosition().lng(),
		  meetadress: ad
    });
    // alert('set ok');
    swal("confirm", "集合地點已設定。", "success");
    //document.getElementById("meetPosition").innerHTML = "<b>集合地點:</b> (" + meetlocation.getPosition().lat()+',' +meetlocation.getPosition().lng()+ ")<br>";
    console.log('have set place');
  }


  function lat2address(meetlocation){
  	geocoder.geocode({
          'latLng': meetlocation.position
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results) {
                    // 將取得的資訊傳入 marker 訊息泡泡
                    //lat2address(results[0], meetlocation);
                    //popup.setContent(results[0].formatted_address);
                    document.getElementById("address").value = results[0].formatted_address;
        			//popup.open(map, meetlocation);
                }
            } else {
                alert("Reverse Geocoding failed because: " + status);
            }
        });
  }

  function address2lat(meetlocation){
	geocoder.geocode({
		'address': document.getElementById('address').value
	}, function(results,status) {
		if(status === google.maps.GeocoderStatus.OK){
			if(results){
				//var latlng = meetlocation.position;
				meetlocation.position = results[0].geometry.location;
				var pos ={
					lat: meetlocation.position.lat(),
					lng: meetlocation.position.lng()
				}
				//setCenter 要再nagivitor裡面用  將地圖中心定位到查詢結果
			    //map.setCenter(pos);
			    meetlocation.setPosition(meetlocation.position); //將標記點定位到查詢結果
			    // document.getElementById("clickPosition").innerHTML = "<b>您輸入的地址位置:</b>(" + meetlocation.position.lat() + "," + meetlocation.position.lng()+ ')<br>';

			    popup.setContent(document.getElementById('address').value);
        			popup.open(map, meetlocation);
			}
		}
	});
  }
