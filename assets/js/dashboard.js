function EventPlanner() {
    console.log("CALLED EventPlanner()");
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.userNameToggle = document.getElementById('user-name-toggle');
    this.signOutButton = document.getElementById('sign-out');
    this.noEventsMsg = document.getElementById('no-events-msg');
    this.eventList = document.getElementById('event-list');

    this.signOutButton.addEventListener('click', this.signOut.bind(this));

    // Adding a click event listener to all elements with a class of ".event-item"
    $(document).on("click", ".event-item", this.showEventDetails);

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

// Loads Events saved and listens for upcoming ones.
EventPlanner.prototype.loadEvents = function() {

    var user = firebase.auth().currentUser;
    console.log("User uid is: " + user.uid);
    // Reference to the /user-events/uid database path.
    console.log("DB: " + this.database.ref('user-events/' + user.uid));
    this.eventsRef = this.database.ref('user-events/' + user.uid);
    // Make sure we remove all previous listeners.
    this.eventsRef.off();

    var count = 1;

    // Loads all the events and listen for new ones.
    var setEvent = function(data) {
    var val = data.val();
    console.log("val :" + JSON.stringify(val));
    console.log("data key: " + data.key);
    this.displayEvent(data.key, val.name, val['startDate'], val['endDate'], val.location, val.image, count);
    count++;
    }.bind(this);
    this.eventsRef.on('child_added', setEvent);
    this.eventsRef.on('child_changed', setEvent);
};

// Template for Event.
EventPlanner.EVENT_TEMPLATE =
    '<div class="event-item" data-toggle="modal" data-target="#eventDetailsModal">' +
        '<div class="overlay"></div>' +
        '<div class="event-item-info">' +
            '<h5 class="item-name"></h5>' +
            '<p><span class="item-startDate"></span> - <span class="item-endDate"></span></p>' +
            '<p class="item-location">Tucson, AZ</p>' +
        '</div>' +
        '<div class="event-item-number">' +
            '<h3 class="item-count">1</h3>' +
        '</div>' +
    '</div>';

// Displays an Event in the dashboard.
EventPlanner.prototype.displayEvent = function(key, name, startDate, endDate, location, image, count) {
  var div = document.getElementById(key);
  // If an element for that event does not exist yet then we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = EventPlanner.EVENT_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.eventList.appendChild(div);
  }

  // Hide the no events msg
  this.noEventsMsg.setAttribute('hidden', 'true');

  console.log(image);

  if (image !== "undefined") {
    div.style.backgroundImage = 'url(' + image + ')';
  }

  div.querySelector('.item-name').textContent = name;
  div.querySelector('.item-startDate').textContent = startDate;
  div.querySelector('.item-endDate').textContent = endDate;
  div.querySelector('.item-location').textContent = location;
  div.querySelector('.item-count').textContent = count;
  
  // Show the event fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
};

// Grabs the Event details from DB
EventPlanner.prototype.showEventDetails = function() {
    console.log(this);
    console.log("Id: " + this.id);
    $('#eventListModal').empty();

    var user = firebase.auth().currentUser;
    // Reference to the /user-events/uid/eventid database path.
    this.detailsRef = eventPlanner.database.ref('user-events/' + user.uid + "/" + this.id);
    this.detailsListRef = eventPlanner.database.ref('event-details/' + this.id);
    // Make sure we remove all previous listeners.
    this.detailsRef.off();
    this.detailsListRef.off();

    console.log("Details: " + this.detailsRef);

    // Loads all the events and listen for new ones.
    var setDetail = function(data) {
        var val = data.val();
        console.log("Modal Val: " + JSON.stringify(val));
        eventPlanner.populateModal(val.name, val['startDate'], val['endDate'], val.location);
    }.bind(this);

    var setDetailList = function(data) {
        var val = data.val();
        console.log("Detail List Val: " + JSON.stringify(val));
        eventPlanner.populateModalList(val.name, val.img, val.url, val.description);
    }.bind(this);

    this.detailsRef.once('value', setDetail);
    this.detailsListRef.on('child_added', setDetailList);
    this.detailsListRef.on('child_changed', setDetailList);
};

// Populates the modal with Event details
EventPlanner.prototype.populateModal = function(name, startDate, endDate, location) {
    var modal = document.getElementById('eventsDetailLabel');

    var startFormat = moment(startDate).format("MMMM D YYYY");
    var endFormat = moment(endDate).format("MMMM D YYYY");

    modal.querySelector('.detail-name-modal').textContent = name;
    modal.querySelector('.detail-startdate-modal').textContent = startFormat;
    modal.querySelector('.detail-enddate-modal').textContent = endFormat;
    modal.querySelector('.detail-location-modal').textContent = location;
}

// Populates the modal with List of Events
EventPlanner.prototype.populateModalList = function(name, img, url, desc) {
    var modal = $('#eventListModal');

    var row = $("<div>").addClass("row modal-event-list");
    var imgCol = $("<div>").addClass("col-4");
    var aTag = $("<a>").attr("href", url)
    aTag.attr("target", "_blank");
    var imgTag = $("<img>").attr("src", img).addClass("rounded img-thumbnail modal-list-image");

    imgCol.append(aTag.append(imgTag));

    var textCol = $("<div>").addClass("col-8");
    var title = $("<p>").text(name);
    var description = $("<p>").text(desc).addClass("font-weight-light");

    textCol.append(title);
    textCol.append(description);

    row.append(imgCol);
    row.append(textCol);

    modal.append(row);
}

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
        this.loadEvents();

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