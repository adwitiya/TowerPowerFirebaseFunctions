const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//An example function that we want to test
function addTwoNumbers(x, y) {
    return x + y;
  }
module.exports = addTwoNumbers;