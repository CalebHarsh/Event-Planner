// // Initialize Firebase
var config = {
  apiKey: "AIzaSyCsJBnT5G6vN1tFi3oamE0cNXkvM0NNUcM",
  authDomain: "event-planner-54834.firebaseapp.com",
  databaseURL: "https://event-planner-54834.firebaseio.com",
  projectId: "event-planner-54834",
  storageBucket: "event-planner-54834.appspot.com",
  messagingSenderId: "803664413287"
};

// MY LOCALHOST TESTING
// Initialize Firebase
// var config = {
//   apiKey: "AIzaSyCGj0VzsfaUXPfXK1yUCjyLU8imQw7SBbs",
//   authDomain: "event-planner-6c6a9.firebaseapp.com",
//   databaseURL: "https://event-planner-6c6a9.firebaseio.com",
//   projectId: "event-planner-6c6a9",
//   storageBucket: "event-planner-6c6a9.appspot.com",
//   messagingSenderId: "168847381672"
// };

//config firebase
firebase.initializeApp(config);

//get access to firebase database
var database = firebase.database();

var activeUser = "Caleb Harshman"

var activeUserEvents = database.ref("/loginUser/" + activeUser + "/events");



function logNewEvent(eventObj) {
  activeUserEvents.once("value", function (snapshot) {

    var events = snapshot.val();

    events[eventObj.name] = {
      "Starting": eventObj.start_date,
      "Ending": eventObj.end_date,
      "Location": eventObj.location
    }

    console.log(activeUserEvents[eventObj.name]);

    activeUserEvents.set(events);
  });

}
// Get the input form
var inputForm = $("#input-form");

// Set a listener for when user clicks submit
inputForm.on("submit", function (event) {
  event.preventDefault();
  $("#results-column").css("display", "block");
  $("#results-column").addClass("animated bounceInRight");
  console.log(event);

  // Store each user input
  var eventName = $("#name-input").val();
  var startDate = $("#start-date-input").val();
  var endDate = $("#end-date-input").val();
  var location = $("#location-input").val();

  console.log(eventName);
  console.log(startDate);
  console.log(endDate);
  console.log(location);

  var newEvent = {
    name: eventName,
    start_date: startDate,
    end_date: endDate,
    location: location
  }

  logNewEvent(newEvent);

  // Now we make our API calls	
});


//Weather API

//Eventbrite API

//Location Auto-complete API
