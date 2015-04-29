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
	/* Google Maps API 3 */
	var map = new google.maps.Map(document.getElementById("map-canvas"), {
		center: new google.maps.LatLng(48.8566667, 2.3509871),
		zoom: 8,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		streetViewControl: false,
	});

	$("button.geolocation").on("tap", geolocation);

	$("button.geolocation").on("click",	geolocation);

	function geolocation() {
		navigator.geolocation.getCurrentPosition(onSuccess, onError);

		// onSuccess Callback
		function onSuccess(position) {
			var geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

			var marker = new google.maps.Marker({
				map: map,
				position: geolocation,
				draggable: false
			});

			marker.setMap(map);
			map.setCenter(geolocation);
			map.setZoom(14);
		};

		// onError Callback receives a PositionError object
		function onError(error) {
			alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
		}
	}
});