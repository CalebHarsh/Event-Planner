// // Initialize Firebase
// var config = {
// 	apiKey: "AIzaSyCsJBnT5G6vN1tFi3oamE0cNXkvM0NNUcM",
// 	authDomain: "event-planner-54834.firebaseapp.com",
// 	databaseURL: "https://event-planner-54834.firebaseio.com",
// 	projectId: "event-planner-54834",
// 	storageBucket: "event-planner-54834.appspot.com",
// 	messagingSenderId: "803664413287"
// };

//config firebase
// firebase.initializeApp(config);

function EventPlanner() {
    console.log("CALLED EventPlanner()");
    this.userName = document.getElementById('user-name');
    this.userNameToggle = document.getElementById('user-name-toggle');
    this.signInButton = document.getElementById('google-sign-in');
    this.signUpButton = document.getElementById('google-sign-up');
    this.basicSignInButton = document.getElementById('basic-sign-in');
    this.signOutButton = document.getElementById('sign-out');

    this.signInButton.addEventListener('click', this.signIn.bind(this));
    this.signUpButton.addEventListener('click', this.signIn.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));

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

// Signs in
EventPlanner.prototype.signIn = function() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

// Signs-out.
EventPlanner.prototype.signOut = function() {
    // Sign out of Firebase.
    this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
EventPlanner.prototype.onAuthStateChanged = function(user) {
    // User is signed in
    if (user) {
        // Get profile pic and user's name from the Firebase user object.
        var profilePicUrl = user.photURL;
        var userName = user.displayName;
        // If user provided a first name and a last name in the registration form then display
        // the first and last name
        if (user.displayName == null && firstname.length > 0 && lastname.length > 0) {
            userName = firstname + " " + lastname;
            // Store the first and last name to the associated login email
            user.updateProfile({
                displayName: userName
            });
        }
        // If first and last name were not provided and username is not set, then display email
        if (userName == null) {
            userName = user.email;
        }

        console.log(user);

        // Set the user's profile pic and name.
        // this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
        this.userName.textContent = userName;

        // Show user's profile and sign-out button.
        this.userNameToggle.removeAttribute('hidden');
        // this.userPic.removeAttribute('hidden');
        // this.signOutButton.removeAttribute('hidden');

        // Hide sign-in buttons.
        // this.signInButton.setAttribute('hidden', 'true');
        this.basicSignInButton.setAttribute('hidden', 'true');

        // // We load currently existing Events.
        // this.loadEvents();

        console.log("PIC URL: " + profilePicUrl);
        console.log("Username: " + userName);

        // Redirect to User Dashboard
        window.location.href = "dashboard.html";

    }
    // User is signed out
    else {
        // Hide user's profile and sign-out button.
        this.userNameToggle.setAttribute('hidden', 'true');
        // this.userPic.setAttribute('hidden', 'true');
        // this.signOutButton.setAttribute('hidden', 'true');

        // Show sign-in button.
        // this.signInButton.removeAttribute('hidden');
        this.basicSignInButton.removeAttribute('hidden');
        console.log("User Not Logged In.")
    }
};

console.log("TEST");

window.eventPlanner = new EventPlanner();


//get access to firebase database
// var database = firebase.database();

// var usersList = database.ref("/users");

// var userLoginRef = database.ref("/loginUser");

// Smooth Scroll script
$(document).ready(function() {
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
            }, 800, function() {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});

// Variable to hold the Login Form
var loginForm = $("#login-form");

loginForm.on("submit", function(event) {

    event.preventDefault();
    // Get Username input
    var email = $("#usernameLogin").val().trim();
    // Get Password input
    var password = $("#passwordLogin").val().trim();

    // Check credentials
    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            displayLoginError();
        });

});

function displayLoginError() {
    document.getElementById("loginError").removeAttribute("hidden");
    $("#loginError").text("Unable to Login");
}

// Variable to hold the Register Form
var registerForm = $("#register-form");
var firstname;
var lastname;

registerForm.on("submit", function(event) {

    event.preventDefault();
    // Get First Name input
    firstname = $("#firstnameRegister").val().trim();
    // Get Last Name input
    lastname = $("#lastnameRegister").val().trim();
    // Get Username input
    var username = $("#usernameRegister").val().trim();
    // Get Password input
    var password = $("#passwordRegister").val().trim();

    if (!validPassword(password)) {
        console.log("password not valid.");
        displayRegisterError("pass");
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(username, password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/email-already-in-use') {
                displayRegisterError("user");
            } else {
                alert(errorMessage);
            }
        });

});

function loginUser(currentUser, userDetails) {

    //Adds User to login branch
    userLoginRef.once("value").then(function(snap) {

        var userOnline = snap.val();

        userOnline[currentUser] = userDetails

        userLoginRef.set(userOnline);

    });

    // Redirect to User Dashboard
    //window.location.href = "dashboard.html";
    // For now, redirect the user to addevent on login. Uncomment above and remove below when done testing.
    window.location.href = "addevent.html";
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
        $("#registerError").text("Email is already in use.");
    } else if (val === "pass") {
        $("#registerError").text("Password must contain 8 characters, 1 Uppercase letter, 1 Lowercase letter, and 1 number.");
    }
}

// Typewriter JS
var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
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

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
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

window.onscroll = () => {
    console.log("SCROLLING");
  var nav = document.getElementById('landing-nav');
  if(this.scrollY <= 500) {
    $(nav).attr("style", "background-color: rgba(0, 42, 74, 0)");
  } else {
     $(nav).attr("style", "background-color: rgba(0, 42, 74, 1)");
  }
};

$("#step1").on("mouseover", function() {
    $("#steps-gif1").removeClass("steps-gif-hidden");
    $("#steps-gif1").addClass("steps-gif-shown");
});

$("#step1").on("mouseleave", function() {
    $("#steps-gif1").addClass("steps-gif-hidden");
    $("#steps-gif1").removeClass("steps-gif-shown");
});

$("#step2").on("mouseover", function() {
    $("#steps-gif2").removeClass("steps-gif-hidden");
    $("#steps-gif2").addClass("steps-gif-shown");
});

$("#step2").on("mouseleave", function() {
    $("#steps-gif2").addClass("steps-gif-hidden");
    $("#steps-gif2").removeClass("steps-gif-shown");
});

$("#step3").on("mouseover", function() {
    $("#steps-gif3").removeClass("steps-gif-hidden");
    $("#steps-gif3").addClass("steps-gif-shown");
});

$("#step3").on("mouseleave", function() {
    $("#steps-gif3").addClass("steps-gif-hidden");
    $("#steps-gif3").removeClass("steps-gif-shown");
});