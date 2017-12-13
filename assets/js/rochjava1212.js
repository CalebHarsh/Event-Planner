//take a location string and return and openWeather search url
function owSearch (location) {

// openweather key
let owKey = "a8c4b798b5cd68523427c1a18a19c7d9"
let owUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + location + "&APPID=" + owKey
	console.log(owUrl)
	return owUrl

}
//____________________________________________


//whenever user clicks submit run owSearch with the locationBox

//  $("#submit").on("click" , function(event){
//  	var location = $("#locationBox").val().trim()
//  	owSearch(location)
//  	console.log("you searched for " + location)
//  }


//_____________________________________________

//take a location string and return an autocomplete url string
function gmSearch (location) {

// google location autocomplete key
let gmKey = "AIzaSyCPxyyNiEkMRZsDMpbD8Sh0jVdfT2cfFp0"
let gmUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/xml?input=" + location + "&types=cities&key=" + gmKey 
console.log(gmUrl)
return gmUrl

}

//_____________________________________________

//whenever user types in a locationBox, run a gmSearch on the keypress 

// $("#locationBox").on("keypress" , function(event) {
// 	gmSearch(event)
// 	return
// }


//____________________________________________

//create buttons to test ajax
function createButtons() {
	btn 
}

//open weather ajax call
function owAjax(){
	$.ajax({
	  url:	owSearch("San Francisco,us"),
	  method: "GET"
	}).done(function(response) {
	   console.log(response)
	   return(response)
  })
}
owAjax()



//testing search functions
gmSearch("San Francisco")
owSearch("San Francisco")
