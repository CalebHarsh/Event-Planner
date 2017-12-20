function EventPlanner() {
    console.log("CALLED EventPlanner()");
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.userNameToggle = document.getElementById('user-name-toggle');
    this.signOutButton = document.getElementById('sign-out');
    this.saveEventButton = document.getElementById('save-event');

    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.saveEventButton.addEventListener('click', this.saveEvent.bind(this));

    this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
EventPlanner.prototype.initFirebase = function() {
    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();
    // Initiates Firebase auth and listen to auth state changes.
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Signs-out.
EventPlanner.prototype.signOut = function() {
    // Sign out of Firebase.
    this.auth.signOut();
};

// Saves the form inputs into the DB
EventPlanner.prototype.saveEvent = function() {
    console.log("saveEvent called!");

    // Get the current user signed in
    var user = firebase.auth().currentUser;
    // Reference to the /user-events/uid database path.
    this.eventsRef = this.database.ref('user-events/' + user.uid);

    this.eventsRef.push({
        name: eventName,
        location: eventLocation,
        startDate: startDate,
        endDate: endDate,
        image: imageSrc
    }).catch(function(error) {
        console.error('Error writing new event to Firebase Database', error);
    });
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
EventPlanner.prototype.onAuthStateChanged = function(user) {
    // User is signed in
    if (user) {
        // Get profile pic and user's name from the Firebase user object.
        var profilePicUrl = user.photoURL;
        var userName = user.displayName;
        // If first and last name were not provided and username is not set, then display email
        if (userName == null) {
            userName = user.email;
        }

        console.log(user);

        // Set the user's profile pic and name.
        this.userPic.style.backgroundImage = 'url(' + (profilePicUrl || 'assets/images/profile_placeholder.png') + ')';
        this.userName.textContent = userName;

        // Show user's profile and sign-out button.
        this.userNameToggle.removeAttribute('hidden');
        // this.userPic.removeAttribute('hidden');

        console.log("PIC URL: " + profilePicUrl);
        console.log("Username: " + userName);

    }
    // User is signed out
    else {
        console.log("User Not Logged In.")
        // Redirect to User Dashboard
        window.location.href = "index.html";
    }
};

window.eventPlanner = new EventPlanner();

// Auto-Complete on Location input
var input = document.getElementById('location-input');
var autocomplete = new google.maps.places.Autocomplete(input, { types: ['(cities)'] });
google.maps.event.addListener(autocomplete, 'place_changed', function () {
	var place = autocomplete.getPlace();
})

// Get the input form
var inputForm = $("#input-form");

// Globals to hold user input
var eventName;
var startDate;
var endDate;
var eventLocation;
var imageSrc;

//roch globals outing and event for save buttons
var outing, restaurant
var saved = []


// Set a listener for when user clicks submit
inputForm.on("submit", function (event) {
	event.preventDefault();
	$("#results-column").css("display", "block");
	$("#results-column").addClass("animated bounceInRight");
	console.log(event);

	// Store each user input
	eventName = $("#name-input").val();
	startDate = $("#start-date-input").val();
	endDate = $("#end-date-input").val();
	eventLocation = $("#location-input").val();

	console.log(eventName);
	console.log(startDate);
	console.log(endDate);
	console.log(eventLocation);

	// Now we make our API calls
	//locationAjax(eventLocation.split(",")[0]);
	locationAjax(eventLocation);
});

function showWeatherResults(eventName, date, location, highTemp, lowTemp) {

	// Get the results-view div
	var resultsView = $("#results-view");

	$("#resultsEventName").text(eventName);
	$("#resultsEventLocation").text(location);
	$("#resultsEventDate").text(date);
	$("#resultsTemperature").text("Low: " + lowTemp + " °F - High: " + highTemp + " °F");

	pixaBayCall(location.split(",")[0].replace(/ /g, "+"));
}

function showWeatherIcon(icon) {
	$("#resultsIcon").addClass("wi wi-forecast-io-" + icon);
}

function getWeatherAPIURL(lat, long, time) {
	var APIkey = "bb3044cbc0686c80eeb8b44883666dd9";
	console.log("TIME");
	console.log(time);
	var query = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/" + APIkey + "/" + lat + "," + long + "," + time;

	return query;
}

function weatherAjax(lat, long, time) {
	$.ajax({
		url: getWeatherAPIURL(lat, long, time),
		method: "GET"
	}).done(function (response) {
		console.log("WEATHER AJAX RESPONSE");
		console.log(response);

		// Get the date of the response
		var responseDate = response.currently.time;
		responseDate = moment(time).format("MMMM Do YYYY");
		console.log("RESPONSE DATE");
		console.log(responseDate);
		// Get the high temperature from the response
		var highTemperature = response.daily.data[0].apparentTemperatureHigh;
		// Get the low temperature from the response
		var lowTemperature = response.daily.data[0].apparentTemperatureLow;
		// Get the temperature icon from the response
		var icon = response.currently.icon;

		// Show our weather results to the page
		showWeatherResults(eventName, responseDate, eventLocation, highTemperature, lowTemperature);
		// Show the weather icon
		showWeatherIcon(icon);
	});
}

function locationSearch(location) {
	// Google API key
	var gKey = "AIzaSyA7MolE0k5_4JYi4_xnIrh4gERM_c4_yxs";
	var gUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + gKey;
	//let owUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + location + "&APPID=" + owKey;

	return gUrl;
}

function locationAjax(location) {
	$.ajax({
		url: locationSearch(location),
		method: "GET"
	}).done(function (response) {
		console.log(response);
		// Get the latitude of the location from the response
		//var latitude = response.city.coord.lat;
		var latitude = response.results[0].geometry.location.lat;
		// Get the longitude of the location from the response
		//var longitude = response.city.coord.lon;
		var longitude = response.results[0].geometry.location.lng;

		// Parse the startDate
		var currentDate = moment(startDate);
		// Get startDate in Unix Timestamp
		var unixStartDate = currentDate.format("X");

		currentDate = currentDate.format();

		// API call to Dark Sky Api to get weather info on startDate
		weatherAjax(latitude, longitude, currentDate, endDate);

		// Get endDate in Unix Timestamp
		var unixEndDate = moment(endDate).format("X");

		console.log("Unix Start: " + unixStartDate);
		console.log("Unix End: " + unixEndDate);

		yelpSearch(latitude, longitude, unixStartDate, unixEndDate, showEvents);
	});
}

function pixaBayCall(keyword) {
	var APIkey = "7343480-bc0b00ce2ed5402b39bf370fe";
	var query = "https://pixabay.com/api/?key=" + APIkey + "&image_type=photo&category=nature&safesearch=true&min_width=700&q=" + keyword;
	console.log(query);

	$.ajax({
		url: query,
		method: "GET"
	}).done(function (response) {
		console.log(response);
		// Store the image url from the response
		imageSrc = response.hits[0].webformatURL;
		// Change the src of the eventImg to the var src
		// $("#eventImg").attr("src", src);
		$("body").css("background-image", "url("+imageSrc+")")
		$("body").css("background-size", "cover")
	});
}


function showEvents(arrayOfEvents) {
	console.log("In showEvents!");
	console.log(arrayOfEvents);

	// Store the Events
	var events = arrayOfEvents[0];
	// Store the restaurants
	var restaurants = arrayOfEvents[1];

	// Get 3 Events to dispay
	for (var i = 0; i < 4; i++) {
		var currentEvent = events.events[i];
		var eventName = currentEvent.name;
		var eventImg = currentEvent.image_url;
		var eventUrl = currentEvent.event_site_url;

		var currentRestaurant = restaurants.businesses[i];
		var restaurantName = currentRestaurant.name;
		var restaurantImg = currentRestaurant.image_url;
		var restaurantUrl = currentRestaurant.url;

		// Change the event#-name in html
		$("#event" + i + "-name").text(eventName);
		// Change the event#-url in html
		$("#event" + i + "-url").attr("href", eventUrl);
		// Change the event#-img in html
		$("#event" + i + "-img").attr("src", eventImg);
		
		// add ID to parent of image
		
		$("#event" + i + "-img").parent().parent().attr("id" , "event" + i + "Container")
		
		// add button to container
		$("#event" + i + "Container").append('<button id="event' + i + '" class="btn btn-primary resultButton">Save</button>')
		
		// Change the restaurant#-name in html
		$("#restaurant" + i + "-name").text(restaurantName);
		// Change the restaurant#-url in html
		$("#restaurant" + i + "-url").attr("href", restaurantUrl);
		// Change the restaurant#-img in html
		$("#restaurant" + i + "-img").attr("src", restaurantImg);


		$("#restaurant" + i + "-img").parent().parent().attr("id" , "restaurant" + i + "Container")
		
		// add button to container
		$("#restaurant" + i + "Container").append('<button id="restaurant' + i + '" class="btn btn-primary resultButton">Save</button>')

//add listener for save buttons
	outing = document.getElementById("event" + i)
	restaurant = document.getElementById("restaurant" + i)
	function save(e) {
	e.addEventListener("click", function(){
		var saving = new Object()
		saving.id = this.getAttribute("id") 
 		saving.name = document.getElementById(this.getAttribute("id") + "-name").innerHTML
		saving.img  = document.getElementById(this.getAttribute("id") + "-img").getAttribute("src")
 		saving.url  = document.getElementById(this.getAttribute("id") + "-url").getAttribute("href")
 		if(saved.indexOf(saving) === -1){
 
 		saved.push(saving)
 }
		console.log("you clicked " + this.getAttribute("id"))	
		})
	}
	
	save(outing)
	save(restaurant)

	} //for loop







} //show array of events
