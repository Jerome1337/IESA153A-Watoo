document.addEventListener('deviceready', function() {
	/* -- STATUSBAR ----------------------------------------------------------------------------------------------------------------- */
	StatusBar.hide();
	
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
							$('section.view section.notes div.messages').empty();
							
							for (var i = 0; i < results.rows.length; i++) {
								$('section.view section.notes div.messages').append('<p>' + results.rows.item(i).id + ' : ' + results.rows.item(i).texte + '</p>');
							}
						}
					});
				});
			});
		}
	}
});