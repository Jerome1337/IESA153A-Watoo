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

	document.getElementById('buttonGeolocation').addEventListener('touchend', geolocation, false);

	function geolocation() {
		navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation, { enableHighAccuracy: true });

		// onSuccessLocation Callback
		function onSuccessLocation(position) {
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

		// onErrorLocation Callback receives a PositionError object
		function onErrorLocation(error) {
			alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
		}
	}
});