// some project specific data that I needed to make sure was working. 
var changePath = require('../../index');

var should = require('should');
var sinon = require('sinon');

describe('given a train which has been removed', function() {

    var out;
    var oldPos;
    var newPos;
    beforeEach(function() {


        oldPos = {
              "code": "WFD",
              "name": "Woodford.",
              "trains": {
                "Westbound": [
                  {
                    "id": "1000626",
                    "dueIn": "6:00",
                    "destination": "West Ruislip",
                    "isStalled": false,
                    "location": "Left Loughton"
                  },
                  {
                    "id": "10006261",
                    "dueIn": "6:00",
                    "destination": "West Ruxislip",
                    "isStalled": false,
                    "location": "Left Loughton"
                  }
                ]
              }
            };
        newPos = {
              "code": "WFD",
              "name": "Woodford.",
              "trains": {
                "Westbound": [
                  {
                    "id": "1000626",
                    "dueIn": "6:00",
                    "destination": "West Ruislip",
                    "isStalled": false,
                    "location": "Left Loughton"
                  }
                ]
              }
            };
        out = changePath('', oldPos, newPos);
    });
    describe('when called', function() {


        it('should report the removal', function() {
            should(out).eql([
              {
                "change": "item removed from list",
                "item": "10006261",
                "parent": ".trains.Westbound",
                "name": ".trains.Westbound[1]"
              }
            ]);
        });
    })
})


