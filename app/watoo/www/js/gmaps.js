$(function() {
	var url = 'http://www.iesanetwork.com/l.lapujade/location.json';
	
	var map = new google.maps.Map(document.getElementById("map-canvas"), {
		center: new google.maps.LatLng(48.8566667, 2.3509871),
		zoom: 12,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		streetViewControl: false,
	});
	
	var iconMarker = {
		url: 'img/marker.png',
		size: new google.maps.Size(32, 32),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(16, 32)
	};

	var iconPosition = {
		url: 'img/mymarker.png',
		size: new google.maps.Size(32, 32),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(16, 32)
	};
	
	$.ajax({
		dataType: 'jsonp',
		contentType: "application/json",
		jsonpCallback: 'jsonCallback',
		async: false,
		url: url,
		success: function(data) {
			var data = data.locations;

			var infoWindow = new google.maps.InfoWindow();

			for (i = 0; i < data.length; i++) {
				var point = new google.maps.LatLng(data[i].lat, data[i].lng);

				var marker = new google.maps.Marker({
					map: map,
					position: point,
					icon: iconMarker,
					title: data[i].title,
					zIndex: i,
					draggable: false
				});

				marker.setMap(map);
			}
		},
		error: function(message) {
			console.log('Failed because: ' + message);
		}
	}); 

	document.getElementById('buttonGeolocation').addEventListener('touchend', geolocation, false);

	function geolocation() {
		navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation, { enableHighAccuracy: true });

		// onSuccessLocation Callback
		function onSuccessLocation(position) {
			var geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

			var position = new google.maps.Marker({
				map: map,
				position: geolocation,
				icon: iconPosition,
				draggable: false
			});

			position.setMap(map);
			map.setCenter(geolocation);
			map.setZoom(14);
		};

		// onErrorLocation Callback receives a PositionError object
		function onErrorLocation(error) {
			alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
		}
	}
});

/*
$(function() {
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
*/