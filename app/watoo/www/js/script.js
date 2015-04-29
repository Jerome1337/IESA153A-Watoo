document.addEventListener('deviceready', this.onDeviceReady, false);


function onDeviceReady() {
	StatusBar.hide();

	var logToDom = function(message) {
	    var e = document.createElement('label');
	    e.innerText = message;

	    var br = document.createElement('br');
	    var br2 = document.createElement('br');
	    document.body.appendChild(e);
	    document.body.appendChild(br);
	    document.body.appendChild(br2);

	    window.scrollTo(0, window.document.height);
	};

	var delegate = new cordova.plugins.locationManager.Delegate();

	delegate.didDetermineStateForRegion = function(pluginResult) {

		// logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

		cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
	};

	delegate.didStartMonitoringForRegion = function(pluginResult) {

		// logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
	};

	delegate.didRangeBeaconsInRegion = function(pluginResult) {
		// logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));

		var beaconsFound = pluginResult.beacons;

		var alertB = document.getElementById('beaconAlert');

		if ( beaconsFound && beaconsFound.length>0 ) {
			alertB.innerHTML = "Votre beacon est proche !";
			// alert('true');
		  	// $broadcast('beacon', true);
		} else if (beaconsFound && beaconsFound.length <= 0) {
		  	// $broadcast('beacon', false);
		  	// alert('false');
		  	alertB.innerHTML = "Votre beacon n'est pas reconnu.";
		}
		
	};

	var uuid = '17586a9d-1fd4-4b05-8a50-ac08b6fdc91c';
	var id = 'iBKS';
	var minor = 1;
	var major = 1;
	var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(id, uuid, major, minor);


	cordova.plugins.locationManager.setDelegate(delegate);
	cordova.plugins.locationManager.requestWhenInUseAuthorization();
	cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
		.fail(console.error)
		.done();

}


$(function() {
    
    // Charger point depuis srv
    var url = 'http://www.iesanetwork.com/t.capitant/test.json';
    
    
     var mapOptions = new google.maps.Map(document.getElementById("map-canvas"), {
		center: new google.maps.LatLng(48.8566667, 2.3509871),
		zoom: 8,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		streetViewControl: false,
         
	    });
    
    $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json) {
    var markers = json.locations;            
    /* Google Maps API 3 */
    
   
    
    var infoWindow = new google.maps.InfoWindow();
 
    for (i = 0; i < markers.length; i++) {
    var image = 'img/marker.png'/*{
    url: '/img/marker.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(22, 32),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 32)
  }*/;
    var data = markers[i]
    var myLatlng = new google.maps.LatLng(data.lat, data.lng);
    var marker = new google.maps.Marker({
    position: myLatlng,
    map: mapOptions,
    icon: image,
    title: data.title
    });
    (function(marker, data) {

    // Attaching a click event to the current marker
    google.maps.event.addListener(marker, "click", function(e) {
    infoWindow.setContent(data.description);
    infoWindow.open(mapOptions, marker);
    });
    })(marker, data);
    }
        },
            error: function(e) {
               console.log('salut');
            }
        
    }); 

    //Geolocation

    
    
	$("button.geolocation").on("tap", geolocation);

	$("button.geolocation").on("click",	geolocation);

	function geolocation() {
		navigator.geolocation.getCurrentPosition(onSuccess, onError);

		// onSuccess Callback
		function onSuccess(position) {
			var geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var mymarkerimg = 'img/mymarker.png'; /*{
                url: 'img/mymarker.png' 'img/mymarker.png',
                // This marker is 20 pixels wide by 32 pixels tall.
                size: new google.maps.Size(22, 32),
                // The origin for this image is 0,0.
                origin: new google.maps.Point(0,0),
                // The anchor for this image is the base of the flagpole at 0,32.
                anchor: new google.maps.Point(0, 32)
              }*/
			var mymarker = new google.maps.Marker({
				map: mapOptions,
				position: geolocation,
				draggable: false,
                icon : mymarkerimg
			});

			mymarker.setMap(mapOptions);
			mapOptions.setCenter(geolocation);
			mapOptions.setZoom(14);
		};

		// onError Callback receives a PositionError object
		function onError(error) {
			alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
		}
	}

    
});




