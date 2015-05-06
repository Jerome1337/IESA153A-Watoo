document.addEventListener('deviceready', function() {
	/* -- BOUSSOLE ------------------------------------------------------------------------------------------------------------------ */
	navigator.compass.watchHeading(onSuccessDirection, onErrorDirection, optionsDirection);

	// onSuccessDirection Callback
	function onSuccessDirection(heading) {
		var direction = document.getElementById('direction');
		if(heading.magneticHeading >= '45' && heading.magneticHeading < '135') {
			direction.innerHTML = 'O';
		}
		else if(heading.magneticHeading >= '120' && heading.magneticHeading < '225') {
			direction.innerHTML = 'S';
		}
		else if(heading.magneticHeading >= '225' && heading.magneticHeading < '315') {
			direction.innerHTML = 'E';
		}
		else {
			direction.innerHTML = 'N';
		}
	};

	// onErrorDirection Callback receives a PositionError object
	function onErrorDirection(compassError) {
		//alert('Compass error: ' + compassError.code);
	};

	var optionsDirection = {
		frequency: 1000
	}; // Update every second

	/* -- PHOTOS -------------------------------------------------------------------------------------------------------------------- */
	var pictureSource = navigator.camera.PictureSourceType;
	var destinationType = navigator.camera.DestinationType;

	document.getElementById('buttonCapturePhoto').addEventListener('touchend', capturePhoto, false);

	document.getElementById('buttonGetPhoto').addEventListener('touchend', function() {
		var source = pictureSource.PHOTOLIBRARY;
		getPhoto(source);
	}, false);

	function capturePhoto() {
		navigator.camera.getPicture(onSuccessCapturePhoto, onErrorPhoto, { quality: 50, destinationType: destinationType.DATA_URL });
	}

	function getPhoto(source) {
		navigator.camera.getPicture(onSuccessGetPhoto, onErrorPhoto, { quality: 50, destinationType: destinationType.FILE_URI, sourceType: source });
	}

	function onSuccessCapturePhoto(imageData) {
		var smallImage = document.getElementById('smallImage');

		smallImage.style.display = 'block';

		smallImage.src = "data:image/jpeg;base64," + imageData;
	}

	function onSuccessGetPhoto(imageURI) {
		var largeImage = document.getElementById('largeImage');

		largeImage.style.display = 'block';

		largeImage.src = imageURI;
	}

	function onErrorPhoto(message) {
		alert('Failed because: ' + message);
	}

	/* -- CONTACTS ------------------------------------------------------------------------------------------------------------------ */
	document.getElementById('buttonPickContact').addEventListener("touchend", getContact, false);

	function getContact() {
		navigator.contacts.pickContact(onSuccessContact, onErrorContact, false);
	}

	function onSuccessContact(contact) {
		var string = "<h2>"+getName(contact)+"</h2>";

		if(contact.emails && contact.emails.length) {
			string += "<p>Email: "+contact.emails[0].value+"</p>";
		}

		if(contact.phoneNumbers && contact.phoneNumbers.length) {
			string += "<p>Phone: "+contact.phoneNumbers[0].value+"</p>";
		}

		if(contact.photos && contact.photos.length) {
			string += "<p><img src='"+contact.photos[0].value+"'></p>";
		}

		document.getElementById('selectedContact').innerHTML = string;
	}

	function onErrorContact(message) {
		alert('Failed because: ' + message);
	}

	function getName(contact) {
		var name = contact.displayName;

		if(!name || name === "") {
			if(contact.name.formatted) {
				return contact.name.formatted;
			}

			if(contact.name.givenName && contact.name.familyName) {
				return contact.name.givenName + " " + contact.name.familyName;
			}

			return "Nameless";
		}

		return name;
	}
}, false);

$(function() {
	/* -- NAVIGATION ---------------------------------------------------------------------------------------------------------------- */
	document.getElementById('buttonOpenNav').addEventListener('touchend', showNavigation, false);

	function showNavigation() {
		$('nav.nav').addClass("open");
		$('div.shadow').show();
	}

	document.getElementById('shadowCloseNav').addEventListener('touchend', hideNavigation, false);

	function hideNavigation() {
		$('nav.nav').removeClass("open");
		$('div.shadow').hide();
	}

	document.getElementById('buttonHome').addEventListener('touchend', function() { var view = 'home'; changeView($(this), view); }, false);
	document.getElementById('buttonPhotos').addEventListener('touchend', function() { var view = 'photos'; changeView($(this), view); }, false);
	document.getElementById('buttonContacts').addEventListener('touchend', function() { var view = 'contacts'; changeView($(this), view); }, false);
	document.getElementById('buttonNotes').addEventListener('touchend', function() { var view = 'notes'; changeView($(this), view); }, false);
	document.getElementById('buttonImports').addEventListener('touchend', function() { var view = 'imports'; changeView($(this), view); }, false);
	document.getElementById('buttonSettings').addEventListener('touchend', function() { var view = 'settings'; changeView($(this), view); }, false);

	function changeView(active, view) {
		if(!active.parent("li").hasClass("active")) {
			active.parent("li").siblings("li.active").removeClass("active");
			active.parent("li").addClass("active");

			setTimeout(function() {
				switch(view) {
					case 'photos':
						changeView('photos');
						break;
					case 'contacts':
						changeView('contacts');
						break;
					case 'notes':
						changeView('notes');
						break;
					case 'imports':
						changeView('imports');
						break;
					case 'settings':
						changeView('settings');
						break;
					default: // else
						changeView('home');
						break;
				}

				function changeView(view){
					$('section.view').children('section.middle').removeClass('middle').addClass('right').delay(300).queue(function(){
						$(this).removeClass('right').addClass('left');
						$(this).dequeue();
					});
					if(view){
						$('section.view').children('section.' + view + '.left').removeClass('left').addClass('middle');
					}
				}

				hideNavigation();
			}, 300);
		}
		else {
			hideNavigation();
		}
	}

	/* -- STORAGE ------------------------------------------------------------------------------------------------------------------- */
	var db = openDatabase('local_database', '1.0', 'database', 2 * 1024 * 1024);

	db.transaction(function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS USERS(id INTEGER PRIMARY KEY, texte)');


		tx.executeSql("SELECT * FROM USERS", [], function(tx, results) {
			if(results.rows) {
				for (var i = 0; i < results.rows.length; i++) {
					$('section.view section.notes div.messages').append('<p>' + results.rows.item(i).id + ' : ' + results.rows.item(i).texte + '</p>');
				}
			}
		});
	});

	document.getElementById('buttonSendMessage').addEventListener('touchend', saveMessage, false);

	function saveMessage() {
		if($('section.view section.notes textarea').val() != '') {
			var textarea = $('section.view section.notes textarea').val();

			db.transaction(function(tx){
				tx.executeSql('INSERT INTO USERS (texte) VALUES (?)', [textarea], function(t, data){
					tx.executeSql("SELECT * FROM USERS", [], function(tx, results) {
						if(results.rows) {
							for (var i = 0; i < results.rows.length; i++) {
								$('section.view section.notes div.messages').empty().append('<p>' + results.rows.item(i).id + ' : ' + results.rows.item(i).texte + '</p>');
							}
						}
					});
				});
			});
		}
	}

<<<<<<< HEAD
	/* -- ACCES REMOTE -------------------------------------------------------------------------------------------------------------- 
=======
// Florian Powaaaaa

	/* -- ACCES REMOTE -------------------------------------------------------------------------------------------------------------- */
>>>>>>> 6f1c8558f2599fa3b2d088316ffffa58b3d8fa7f
	var url = 'http://www.iesanetwork.com/t.capitant/test.json';

	$.ajax({
		type: 'GET',
		url: url,
		async: false,
		jsonpCallback: 'jsonCallback',
		contentType: 'application/json',
		dataType: 'jsonp',
		success: function(json) {
			var locations = json.locations;
			var string = "";

			for (i = 0; i < locations.length; i++) {
				string += '<h2>' + locations[i].title + '</h2>';
				string += '<p>latitude: ' + locations[i].lat + '</p>';
				string += '<p>longitude: ' + locations[i].lng + '</p>';
			}

			document.getElementById('imports').innerHTML = string;
		}
	});
<<<<<<< HEAD
    */
=======

/*
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
    
   
    /*
    var infoWindow = new google.maps.InfoWindow();
 
    for (i = 0; i < markers.length; i++) {
    var image = 'img/marker.png';
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
              }*//*
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
	}*/
>>>>>>> 6f1c8558f2599fa3b2d088316ffffa58b3d8fa7f
});