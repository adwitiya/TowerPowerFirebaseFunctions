const expect = require('chai').expect
const Matchmaking = require('../index').Matchmaking
const afar = require('afar')
var radius = 0.5; //In kilometres

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
    for(i = 0; i < result_list.length - 1; ++i) {
        for(j = 0; j < result_list.length - i; ++j) {
            if(result_list[i].Role === result_list[j].Role) {
                return false;
            }
        }
    }
    return true;
}

var CloseTogether = function(result_list) {
    for(i = 0; i < result_list.length - 1; ++i) {
        for(j = 0; j < result_list.length - i; ++j) {
            var location1 = result_list[i];
            var location2 = result_list[j];
            if(afar(location1.latitude, location1.longitude,
                    location2.latitude, location2.longitude) > 2 * radius) {
                    return false;
                }
            }
        }
    return true;
}

describe('Matchmaking()', (user_list) => {
     //Arrange
     user_list = []
     var location1 = new Location(12, -10)
     var user1 = new User(1, "Defender", location1);
     user_list.push(user1);
     user_list.push(user1);
     user_list.push(user1);

     //Act
     var result = Matchmaking(user_list)

    it('should return three users',
    () => {
        expect(result.length).to.be.equal(3);
    });
    it('should return users with different roles',
    () => {
        expect(DifferentRoles(result)).to.be.equal(true);
    });
    it('should return users close together',
    () => {
        expect(CloseTogether(result)).to.be.equal(true);
    });
});
