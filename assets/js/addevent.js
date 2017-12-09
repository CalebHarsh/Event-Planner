// Get the input form
var inputForm = $("#input-form");

// Set a listener for when user clicks submit
inputForm.on("submit", function(event) {
	event.preventDefault();
	$("#results-column").css("display", "block");
	$("#results-column").addClass("animated bounceInRight");
	console.log(event);

	// Store each user input
	var eventName = $("#name-input").val();
	var startDate = $("#start-date-input").val();
	var endDate = $("#end-date-input").val();
	var location =$("#location-input").val();

	console.log(eventName);
	console.log(startDate);
	console.log(endDate);
	console.log(location);

	// Now we make our API calls	
})