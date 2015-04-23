$(function() {
	/* Gestion du menu */
	$("button.nav").click(function() {
		if($("nav.nav").hasClass("open")) {
			$("nav.nav").removeClass("open");
		}
		else {
			$("nav.nav").addClass("open");
		}
	});

	/* Google Maps API 3 */
	var map = new google.maps.Map(document.getElementById("map-canvas"), {
		center: new google.maps.LatLng(48.8566667, 2.3509871),
		zoom: 7,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		streetViewControl: false,
	});

	$("button.geolocation").click(function() {
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
	});



	


});


$(document).ready(function(){
	window.analytics.startTrackerWithId('UA-62198728-1');
    window.analytics.trackView('Homepage');
    window.analytics.debugMode();
});
