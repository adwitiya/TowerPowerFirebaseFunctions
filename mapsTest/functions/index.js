const functions = require('firebase-functions');
//Note that I changed this from a var to a const change back if causes problems

  //Take in a location and a radius(?)
//Generate one point inside of this circle - how to make it a diff point

    //Get a random location inside of the starting circle, then
    //Try to move this to a place
    //If a new place can't be found, put it on a road
    //We need to make sure these generated points still lie inside the game area

//For a number of points repeat the above
const randomLocation = require('random-location')

//NOTE the arrow operator => creates arrow functions, very similar to lambda
//functions in other languages
firestore_location = '/locations/{documentId}'
//Perhaps this should be on on write
// exports.TowerLocation = functions.firestore.document(firestore_location).onCreate((event) => {
        
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
    
    //TODO it could be a good idea to put a timeout in this
    //Not sure what the unit for this timeout is though
    var places_request = {
        language: 'en',
        location: centre,
        radius: search_radius,
        rankby: 'prominence',
    }

    //Return later
    googleMapsClient.placesNearby(places_request)
    .asPromise()
    .then(places => {
        console.log(places.json.results.length)
        //console.log(JSON.stringify(places, null, 2))
    }
    )
    .catch(err => {
        console.log(err)
    }
    )
    //If not enough points, return some random ones
    //Use the below to do that
    //const randomPoint = randomLocation.randomCirclePoint(P, R)
