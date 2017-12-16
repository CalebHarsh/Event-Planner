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
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.userNameToggle = document.getElementById('user-name-toggle');
    this.signOutButton = document.getElementById('sign-out');

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

        // // We load currently existing Events.
        // this.loadEvents();

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