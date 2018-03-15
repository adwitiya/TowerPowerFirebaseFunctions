const expect = require('chai').expect
const Matchmaking = require('../index').Matchmaking

describe('Matchmaking()', (user_list) => {
    it('should return three users that are close together, 3 roles',
    () => {
        //Arrange

        //Act
        var result = Matchmaking(user_list)

        //Assert

        //There should be three roles
        expect(result.length).to.be.equal(3);

        //All roles should be different


        //The users should be close together
    });
});
