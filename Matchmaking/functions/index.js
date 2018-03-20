const functions = require('firebase-functions');
const clustering = require('density-clustering');
//See https://www.npmjs.com/package/density-clustering if want to try clustering

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var MakePositionsList = function(user_list) {
    var list = [];
    for(i = 0; i < user_list.length; ++i) {
        var location = [];
        location.push(user_list[i].latitude);
        location.push(user_list[i].longitude);
        list.push(location);
    }
    return list;
}

var Matchmaking = function(user_list) {
    var result_list = [];

    if(user_list.length < 3) {
        console.log("not enough users to build a team at the moment");
        return result_list;
    }

    var positions = MakePositionsList(user_list)
    var kmeans = new clustering.KMEANS();
    var clusters = kmeans.run(positions, Math.floor(user_list.length / 3));
    console.log("clusters are ", clusters)

    var big_cluster = []
    //Pick the first cluster with length less than 3
    for(i = 0; i < clusters.length; ++i) {
        if(clusters[i].length >= 3) {
            big_cluster = clusters[i];
        }
    }

    if(big_cluster.length < 3) {
        console.log("not enough users in any cluster")
        return result_list;
    }

    while(result_list.length < 3) {
        user = user_list[big_cluster.pop()]
        console.log(user);
        result_list.push(user);
    }

    console.log("Resulting users are ", result_list)
    return result_list;
}

exports.Matchmaking = Matchmaking;

firestore_matchmaking = '/matchmaking'

//Note, perhaps this should be on on write
// exports.PlaceLocations = 
// functions.firestore.document(firestore_matchmaking).onCreate(
//     (event) => {
//         users = event.data.data()
//         Matchmaking(users)
//     }
// )