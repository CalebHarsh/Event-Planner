function eventSearch (location){
let esURL = "http://api.eventful.com/rest/events/search?app_key=f9x6KV3zxtTcf9qv&location=" + location + "&date=Future"
$.ajax({
  url: esURL,
  method: "GET"
})
	.done(function(response) {
		console.log("success" + response)
		})
	.fail(function() {
		console.log("fail")
		})
}
eventSearch("San Francisco")
