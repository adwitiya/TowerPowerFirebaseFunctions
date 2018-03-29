var assert = require('assert');
const chai = require('chai')
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


describe('Test Farthest Location', function(){
  
  var input = [
    {
      'latitude': 53.44564324,
      'longitude':  -5.3435335
    },
    {
      'latitude': 15.123123,
      'longitude': 26.213123
    } 
  ];

  var centre = {
    'latitude' : 53.44566,
    'longitude': -6.3435335
  };

  var return_val = placeLocations.FindNFarthestLocation(input, centre);

  it('Should Return one of', function(){
    chai.assert.oneOf(return_val.latitude, [input[0].latitude, input[1].latitude]);
  });
});