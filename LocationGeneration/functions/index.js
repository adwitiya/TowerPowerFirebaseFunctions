const functions = require('firebase-functions');
const randomLocation = require('random-location')

//NOTE the arrow operator => creates arrow functions, very similar to lambda
//functions in other languages
firestore_location = '/teams/{teamID}/games/{gameID}'


var googleMapsClient = require('@google/maps').createClient({
    key: "GET_YOUR_OWN",
    Promise: Promise
});

// Method that uses nested promises to make back to back calls to placesNearby
// NOTE: eslint warns not to use nested promises
// NOTE: Timeout of 5000 milliseconds between placesNearby calls required by the API
function allPlacesNearby(query, soFar = []) {
    console.info(`sending placesNearby query: ${JSON.stringify(query)}`);
    return new Promise((resolve, reject) => googleMapsClient.placesNearby(query, (err, response) => (err ? reject(err) : resolve(response))))
    .then(result => {
      console.info(`received ${result.json.results.length} results`);
      const allResults = soFar.concat(result.json.results);
      const { next_page_token: nextPageToken } = result.json;
      if (nextPageToken) {
        return new Promise(resolve => setTimeout(resolve, 5000)).then(() => allPlacesNearby({
          "location": query.location,
          "pagetoken": nextPageToken
        }, allResults));
      }
      return allResults;
    });
  }

//Note, perhaps this should be on on write
exports.PlaceLocations = 
functions.firestore.document(firestore_location).onCreate(
    (event) => {
        
        var document_data = event.data.data()

        //This will be set when we call this function from firebase
        var centre = {
            latitude: document_data.latitude,
            longitude: document_data.longitude
        }

        //TODO decide if we should take in a radius
        var search_radius = 500
        // Making three calls to placesNearby to get 60 non-duplicate places
        var num_points_required = 60
        
        //TODO it could be a good idea to put a timeout in this
        //Not sure what the unit for this timeout is though
        var places_request = {
            language: 'en',
            location: centre,
            radius: search_radius,
            rankby: 'prominence',
        }

        return allPlacesNearby(places_request)
        .then(response =>{

            console.log("Found ", response.length, " places from API, generating the other",
             num_points_required - response.length, " points randomly")

            var generated_locations = {}
            var count = 0;
            for(i = 0 ; i < response.length; i++)
            {
                var location = response[i].geometry.location;
                var push_location = {}
                push_location["latitude"] = location.lat
                push_location["longitude"] = location.lng
                generated_locations["location" + count.toString()] = push_location
                ++count;
            }

            //If not enough points, return some random ones
            for(i = 0; i < num_points_required - response.length; ++i) {
                var randomPoint = 
                randomLocation.randomCirclePoint(centre, search_radius)
                generated_locations["location" + count.toString()] = randomPoint
                ++count;
            }

            console.log("Total Locations Added: " + count);
            return event.data.ref.set({generated_locations}, {merge: true})
        })
        .catch(err => {
        console.error(`err: ${err}`)
    })
    }
)
