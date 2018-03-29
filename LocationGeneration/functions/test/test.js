var assert = require('assert');
const expect = require('chai').expect
const placeLocations = require('../index_UT');

describe('Return Promise', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe('Test Remove Element', function(){
  
  var input = [
    {
      'latitude': 5,
      'longitude': 6
    },
    {
      'latitude': 15,
      'longitude': 26
    } 
];
  var output = [
    {
      'latitude': 15,
      'longitude': 26
    } 
];

  placeLocations.RemoveElement(input, {
    'latitude': 5,
    'longitude': 6
  });

  it('Should Remove an Element', function(){
    assert.equal(input[0].latitude, output[0].latitude);
  });
});