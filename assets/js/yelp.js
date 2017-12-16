let token = "wZvyZC1_O8ICJQ2dO3N9ICI8PrffGCTMPI20txzJBGgaVJ1QED9FU4UYu1KU62XTFG-L8shOc5ww93R-oSf3HQt1BuRmhcSuZKwETdohvWRrWsgpzN8dAjqYANYyWnYx";
//function roch (x) { console.log(x)}

//function to get events
//this function takes latitude, longitude, start & end time in Unix Timestamp, and callback function
//returns an array containing 2 objects, 
//array[0] = object with 10 events, array[1] = object with 10 restaurants around the long/lat
//________________________

function yelpSearch(latitude, longitude, start, end, cb) {
	var results = [];
	let search = new Object();
	search.latitude = latitude;
	search.longitude = longitude;
	search.start = start;
	search.end = end;
	
	console.log(search);		

let eventsResults = {};
let restaurantResults = {};
			

var eventsReturn = {
  "async": true,
  "crossDomain": true,
  "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/events?longitude=" + search.longitude + "&latitude=" + search.latitude + "&start_date=" + search.start + "&end_date=" + search.end + "&sort_on=popularity&sort_by=desc&limit=10",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer wZvyZC1_O8ICJQ2dO3N9ICI8PrffGCTMPI20txzJBGgaVJ1QED9FU4UYu1KU62XTFG-L8shOc5ww93R-oSf3HQt1BuRmhcSuZKwETdohvWRrWsgpzN8dAjqYANYyWnYx",
    "Cache-Control": "no-cache",
  }
}


var restaurantsReturn = {
  "async": true,
  "crossDomain": true,
  "url":"https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?longitude=" + search.longitude + "&latitude=" + search.latitude + "&limit=10",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer wZvyZC1_O8ICJQ2dO3N9ICI8PrffGCTMPI20txzJBGgaVJ1QED9FU4UYu1KU62XTFG-L8shOc5ww93R-oSf3HQt1BuRmhcSuZKwETdohvWRrWsgpzN8dAjqYANYyWnYx",
    "Cache-Control": "no-cache",
  }
}


console.log(eventsReturn.url);


console.log(restaurantsReturn.url);

 $.ajax(eventsReturn).then(function (response) {
   console.log(response);
   eventsResults = response;
   results.push(eventsResults);
	return $.ajax(restaurantsReturn);
 })
	.fail(function (error) {
	console.log(error);
	
})
	.done(function (completion) {
   console.log(completion);
   restaurantsResults = completion;
   results.push(restaurantsResults);
	cb(results);
 });


} //yelpsearch()

