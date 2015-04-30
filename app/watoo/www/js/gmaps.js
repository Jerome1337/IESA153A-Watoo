$(function() {
    
    var url = 'http://www.iesanetwork.com/t.capitant/test.json';
    
	/* Google Maps API 3 */
	var mapOptions = new google.maps.Map(document.getElementById("map-canvas"), {
		center: new google.maps.LatLng(48.8566667, 2.3509871),
		zoom: 8,
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		streetViewControl: false,
    });
    
    var image = {
    url: 'img/marker.png',
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(31, 45),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(15, 45)
    };
    
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

	document.getElementById('buttonGeolocation').addEventListener('touchend', geolocation, false);

	function geolocation() {
		navigator.geolocation.getCurrentPosition(onSuccessLocation, onErrorLocation, { enableHighAccuracy: true });

		// onSuccessLocation Callback
		function onSuccessLocation(position) {
			var geolocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var mymarkerimg = {
                url: 'img/mymarker.png',
                // This marker is 20 pixels wide by 32 pixels tall.
                size: new google.maps.Size(31, 45),
                // The origin for this image is 0,0.
                origin: new google.maps.Point(0,0),
                // The anchor for this image is the base of the flagpole at 0,32.
                anchor: new google.maps.Point(15, 45)
              }
			var mymarker = new google.maps.Marker({
				map: map,
				position: geolocation,
				draggable: false
			});

			mymarker.setMap(map);
			mapOptions.setCenter(geolocation);
			mapOptions.setZoom(14);
		};

		// onErrorLocation Callback receives a PositionError object
		function onErrorLocation(error) {
			alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
		}
	}
});