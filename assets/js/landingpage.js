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
//   var config = {
//     apiKey: "AIzaSyCGj0VzsfaUXPfXK1yUCjyLU8imQw7SBbs",
//     authDomain: "event-planner-6c6a9.firebaseapp.com",
//     databaseURL: "https://event-planner-6c6a9.firebaseio.com",
//     projectId: "event-planner-6c6a9",
//     storageBucket: "event-planner-6c6a9.appspot.com",
//     messagingSenderId: "168847381672"
//   };

//config firebase
firebase.initializeApp(config);

//get access to firebase database
var database = firebase.database();

var usersList = database.ref("/users");

var userLoginRef = database.ref("/loginUser");

// Smooth Scroll script
$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
       
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});

// Variable to hold the Login Form
var loginForm = $("#login-form");

loginForm.on("submit", function (event) {

	event.preventDefault();
	// Get Username input
	var username = $("#usernameLogin").val().trim();
	// Get Password input
	var password = $("#passwordLogin").val().trim();
	// Check credentials

  usersList.once('value').then(function (snapshot) {
		// Get the object that holds username => password as an object
		var accounts = snapshot.val();
		console.log(accounts);
		if(!accounts) {
			displayLoginError();
			return;
		}else if (!(username in accounts)) {
			console.log(username + " not found.");
			displayLoginError();
			return;
		}
		if (!(snapshot.val()[username].Password == password)) {
			console.log("password for " + username + " not correct.");
			displayLoginError();
			return;
		}
		console.log("Login Successful");

		//logins in using the username and user's info
		loginUser(username);
	});
});

function displayLoginError() {
	$("#loginError").text("Unable to Login");
}

// Variable to hold the Register Form
var registerForm = $("#register-form");

registerForm.on("submit", function (event) {

	event.preventDefault();
	// Get Username input
	var username = $("#usernameRegister").val().trim();
	// Get Password input
	var password = $("#passwordRegister").val().trim();

	// Check if username already exist

  usersList.once('value').then(function (snapshot) {
		// Get the object that holds username => password as an object
		var accounts = snapshot.val();
		console.log(accounts);
		if(!accounts) {
			
		}else if (username in accounts) {
			console.log(username + " already taken.");
			displayRegisterError("user");
			return;
		}
		if (!validPassword(password)) {
			console.log("password not valid.");
			displayRegisterError("pass");
			return;
		}

		var toInsert = database.ref("/users/" + username);
		
		toInsert.set({
			"Username": username,
			"Password": password
		});
		

		console.log("Register Successful");

		//Logins using the username and user's info
		loginUser(username);
	});
});

function loginUser(currentUser) {

	//Adds User to login branch
	database.ref("/users/" + currentUser).once("value").then(function (snap) {

		userDetails = snap.val();
		console.log(userDetails);

		userLoginRef = database.ref("/loginUser/" + currentUser);
		userLoginRef.set(userDetails);

		//userLoginRef.set(userOnline);

	});

	// Redirect to User Dashboard
	//window.location.href = "dashboard.html";
	// For now, redirect the user to addevent on login. Uncomment above and remove below when done testing.
	//window.location.href = "addevent.html";
}

function validPassword(pass) {
	if (!isNaN(pass) || pass.length < 8) {
		return false;
	}

	var upper = false;
	var lower = false;
	var number = false;

	for (var i = 0; i < pass.length; i++) {
		var character = pass.charAt(i);
		if (character == character.toUpperCase()) {
			upper = true;
		}
		if (character == character.toLowerCase()) {
			lower = true;
		}
		if (!isNaN(character)) {
			number = true;
		}
	}

	return (upper && lower && number);
}

function displayRegisterError(val) {
	if (val === "user") {
		$("#registerError").text("Username is already taken.");
	} else if (val === "pass") {
		$("#registerError").text("Password must contain 8 characters, 1 Uppercase letter, 1 Lowercase letter, and 1 number.");
	}
}

// Typewriter JS
var TxtType = function (el, toRotate, period) {
	this.toRotate = toRotate;
	this.el = el;
	this.loopNum = 0;
	this.period = parseInt(period, 10) || 2000;
	this.txt = '';
	this.tick();
	this.isDeleting = false;
};

TxtType.prototype.tick = function () {
	var i = this.loopNum % this.toRotate.length;
	var fullTxt = this.toRotate[i];

	if (this.isDeleting) {
		this.txt = fullTxt.substring(0, this.txt.length - 1);
	} else {
		this.txt = fullTxt.substring(0, this.txt.length + 1);
	}

	this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

	var that = this;
	var delta = 200 - Math.random() * 100;

	if (this.isDeleting) { delta /= 2; }

	if (!this.isDeleting && this.txt === fullTxt) {
		delta = this.period;
		this.isDeleting = true;
	} else if (this.isDeleting && this.txt === '') {
		this.isDeleting = false;
		this.loopNum++;
		delta = 500;
	}

	setTimeout(function () {
		that.tick();
	}, delta);
};

window.onload = function () {
	var elements = document.getElementsByClassName('typewrite');
	for (var i = 0; i < elements.length; i++) {
		var toRotate = elements[i].getAttribute('data-type');
		var period = elements[i].getAttribute('data-period');
		if (toRotate) {
			new TxtType(elements[i], JSON.parse(toRotate), period);
		}
	}
	// INJECT CSS
	var css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
	document.body.appendChild(css);
};
