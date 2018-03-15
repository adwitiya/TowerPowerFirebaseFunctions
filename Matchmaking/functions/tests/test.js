const expect = require('chai').expect
//const addTwoNumbers = require('addTwoNumbers')

//I should really be importing this, but for a test
function addTwoNumbers(x, y) {
    return x + y;
  }

//This creates the test environment
describe('addTwoNumbers()', () => {
    //This defines the tests needed to be passed
    it('should add two numbers', () => {
        //Arrange
        var x = 5;
        var y = 1;
        var sum1 = x + y;

        //Act
        var sum2 = addTwoNumbers(x, y);

        //Assert
        expect(sum2).to.be.equal(sum1);
    });
});
