const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var Matchmaking = function(user_list) {
    var result_list = [];

    if(user_list.length < 3) {
        console.log("not enough users to build a team at the moment");
        return result_list
    }
    
    while(result_list.length < 3) {
        result_list.push(user_list.pop());
    }
    console.log("remaining users are", user_list);
    return result_list;
}

exports.Matchmaking = Matchmaking;