var input = document.getElementById('location-input');
var autocomplete = new google.maps.places.Autocomplete(input,{types: ['(cities)']});
google.maps.event.addListener(autocomplete, 'place_changed', function(){
	var place = autocomplete.getPlace();
})

// Get the input form
var inputForm = $("#input-form");

// Globals to hold user input
var eventName;
var startDate;
var endDate;
var eventLocation;

// Set a listener for when user clicks submit
inputForm.on("submit", function(event) {
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

		// FIREBASE STUFF
	// we get uid of logged in user,
	var currentUserid=firebase.auth().currentUser.uid
	console.log(currentUserid)
	// ref is where we are storing the firebase 
	// push adds a new element 
	// sets the values
	eventPlanner.database.ref("events/"+currenttUserid).push().set({
		eventName: eventName,
		startDate: startDate,
		endDate: endDate,
		eventLocation: eventLocation,
	})


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
	$("#resultsTemperature").text(lowTemp + " °F - " + highTemp + " °F");

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
	  url:	getWeatherAPIURL(lat, long, time),
	  method: "GET"
	}).done(function(response) {
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

function locationAjax(location){
	$.ajax({
	  url:	locationSearch(location),
	  method: "GET"
	}).done(function(response) {
		console.log(response);
		// Get the latitude of the location from the response
		//var latitude = response.city.coord.lat;
		var latitude = response.results[0].geometry.location.lat;
		// Get the longitude of the location from the response
		//var longitude = response.city.coord.lon;
		var longitude = response.results[0].geometry.location.lng;

		// Parse the startDate
		startDate = moment(startDate);
		startDate = startDate.format();

		// API call to Dark Sky Api to get weather info on startDate
		weatherAjax(latitude, longitude, startDate);
  });
}

function pixaBayCall(keyword) {
	var APIkey = "7343480-bc0b00ce2ed5402b39bf370fe";
	var query = "https://pixabay.com/api/?key=" + APIkey + "&image_type=photo&category=nature&safesearch=true&min_width=700&q=" + keyword;
	console.log(query);

	$.ajax({
		url: query,
		method: "GET"
	}).done(function(response) {
		console.log(response);
		// Store the image url from the response
		var src = response.hits[0].webformatURL;
		// Change the src of the eventImg to the var src
		$("#eventImg").attr("src", src);
	});
}

