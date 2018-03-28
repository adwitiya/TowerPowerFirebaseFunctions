const functions = require('firebase-functions');
const admin = require('firebase-admin');
const clustering = require('density-clustering');
const afar = require('afar')

admin.initializeApp(functions.config().firebase);
const db = admin.firestore()
var radius = 0.5; //In kilometres
const firestore_collection = '/matchmaking'
const firestore_location = firestore_collection + '/{userID}'

exports.matchmaking = 
functions.firestore.document(firestore_location).onCreate(
    (event) => {
        var user_list = []
        return allUsers = db.collection(firestore_collection).get()
        .then(snapshot => {
            //Retrieve all the users
            snapshot.forEach(doc => {
                user_list.push(doc.data())
            });
            console.log("users are", user_list)

            //TODO remove
            if(user_list.length < 3) {
                console.log("not enough users to build a team at the moment");
                return true
            }
        
            var matched_users = []

            for(i = 0; i < user_list.length - 2; ++i) {
                var user_matches = [user_list[i]]
                for(j = i + 1; j < user_list.length; ++j) {
                    var location1 = user_list[i].location;
                    var location2 = user_list[j].location;
                    var distance = afar(location1.latitude, location1.longitude,
                                        location2.latitude, location2.longitude);
                    if(distance < 2 * radius) {
                            user_matches.push(user_list[j])
                    }
                }
                var different_roles = true
                const random_role_name = "random"
                for(i = 0; i < user_matches.length - 1; i++) {
                    for(j = i + 1; j < user_matches.length; j++) {
                        if(user_matches[i].role !== random_role_name &&
                            user_matches[i].role === user_matches[j].role) {
                            different_roles = false;
                        }
                    }
                }
                //console.log(DifferentRoles(user_matches))
                if((user_matches.length >= 3) && different_roles) {
                    matched_users = user_matches
                    break;
                }
            }

            console.log("matched users are", matched_users)

            if(matched_users.length === 0) {
                console.log("No suitable team found")
                return true
            }
            
            //Update the database
            var batch = db.batch()
            // Create a ref with auto-generated ID
            var new_team_ref = db.collection('teams').doc();
            var new_game_ref = db.collection('teams').doc(new_team_ref.id).collection('games').doc();
            var team_id = new_team_ref.id
            var team = {current_game: new_game_ref.id}
            //Delete these three users from this database
            var centre_x = 0
            var centre_y = 0
            for(i = 0; i < 3; ++i) {
                var user_match_ref = db.collection("matchmaking").doc(matched_users[i].userID)
                var user_ref = db.collection("users").doc(matched_users[i].userID)
                batch.delete(user_match_ref)
                batch.set(user_ref, {"team_id": team_id}, {merge: true})
                matched_users[i]["response"] = "pending"
                team["user" + i.toString()] = matched_users[i]
                centre_x += matched_users[i].location.latitude
                centre_y += matched_users[i].location.longitude
            }
            // Add it in the batch
            batch.set(new_team_ref, team);
            //Get the centroid of the triangle
            centre_x /= 3.0
            centre_y /= 3.0
            var game = {latitude: centre_x, longitude: centre_y}
            batch.set(new_game_ref, game)
            return batch.commit()
        })
        .catch(err => {
            console.log('Error getting documents', err);
            return true
        });
    }
)

//Create a user
function User(id, role, start_location) {
    this.ID = id;
    this.Role = role;
    this.StartLocation = start_location;
}

function Location(lat, long) {
    this.latitude = lat;
    this.longitude = long;
}

var DifferentRoles = function(result_list) {
    const random_role_name = "random"
    for(i = 0; i < result_list.length - 1; i++) {
        for(j = i + 1; j < result_list.length; j++) {
            if(result_list[i].role !== random_role_name &&
                result_list[i].role === result_list[j].role) {
                return false;
            }
        }
    }
    return true;
}

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

//Returns a set of users that match
var MatchUsers = function(user_list) {
    for(i = 0; i < user_list.length - 2; ++i) {
        var user_matches = [user_list[i]]
        for(j = i + 1; j < user_list.length; ++j) {
            var location1 = user_list[i].location;
            var location2 = user_list[j].location;
            var distance = afar(location1.latitude, location1.longitude,
                                location2.latitude, location2.longitude);
            if(distance < 2 * radius) {
                    user_matches.push(user_list[j])
            }
        }
        var different_roles = DifferentRoles(user_matches)
        //console.log(DifferentRoles(user_matches))
        if((user_matches.length >= 3) && different_roles) {
            return user_matches
        }
    }
    //No suitable users found 
    return []
}

//Overall matchmaking, which uses match users
var Matchmaking = function(user_list) {
    if(user_list.length < 3) {
        console.log("not enough users to build a team at the moment");
        return []
    }

    var matched_users = MatchUsers(user_list)
    if(matched_users.length === 0) {
        console.log("No suitable team found")
        return []
    }

    console.log("Resulting users are ", matched_users)
    return matched_users;
}

exports.Matchmaking = Matchmaking;