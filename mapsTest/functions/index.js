const functions = require('firebase-functions');
const randomLocation = require('random-location')

//NOTE the arrow operator => creates arrow functions, very similar to lambda
//functions in other languages
firestore_location = '/locations/{documentId}'

//Note, perhaps this should be on on write
exports.PlaceLocations = 
functions.firestore.document(firestore_location).onCreate(
    (event) => {
        
        var googleMapsClient = require('@google/maps').createClient({
            key: "GET_YOUR_OWN",
            Promise: Promise
        });
        
        //This will be set when we call this function from firebase
        var centre = {
            latitude: 37.7768006,
            longitude: -122.4187928
        }

        var search_radius = 500
        var num_points_required = 20
        
        //TODO it could be a good idea to put a timeout in this
        //Not sure what the unit for this timeout is though
        var places_request = {
            language: 'en',
            location: centre,
            radius: search_radius,
            rankby: 'prominence',
        }

        return googleMapsClient.placesNearby(places_request)
        .asPromise()
        .then(response => {
            var places = response.json.results
            console.log("Using ahhhahahh")
            console.log(JSON.stringify(places, null, 2))
            
            var generated_locations = {"locations": []}
            for(i = 0; i < places.length; ++i) {
                var location = places[i].geometry.location
                generated_locations.locations.push(location)
            }

            //If not enough points, return some random ones
            for(i = 0; i < num_points_required - places.length; ++i) {
                var randomPoint = 
                randomLocation.randomCirclePoint(centre, search_radius)
                generated_locations.locations.push(randomPoint)
            }

            return event.data.ref.set({generated_locations}, {merge: true})
        }
        )
        .catch(err => {
            console.log(err)
        }
        )
    }
)
