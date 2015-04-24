document.addEventListener('deviceready', this.onDeviceReady, false);

function onDeviceReady() {
	var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
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