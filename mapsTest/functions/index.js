const functions = require('firebase-functions');
var location_data

firestore_location = '/locations/{documentId}'
//Perhaps this should be on on write
exports.TowerLocation = functions.firestore.document(firestore_location).onCreate((event) => {
    var googleMapsClient = require('@google/maps').createClient({
        key: "Get_Your_Own"
    });

    // Geocode an address.
    
    //We are having a problem with asynchronous execution.
    googleMapsClient.geocode({
        address: '1600 Amphitheatre Parkway, Mountain View, CA'
    }, function(err, response) {
        if (!err) {
        location_data = response.json.results;
        console.log('Modifying location', event.params.documentId);
        console.log(JSON.stringify(location_data, null, 2));
        }
    }); 

    console.log("got", JSON.stringify(location_data, null, 2))
    return event.data.ref.set({location_data}, {merge: true});
});
