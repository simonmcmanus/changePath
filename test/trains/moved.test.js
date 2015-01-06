// some project specific data that I needed to make sure was working. 
var changePath = require('../../index');

var should = require('should');

var codes = require('../../codes');

describe('given a train which has moved', function() {
    var out;
    var oldPos;
    var newPos;
    beforeEach(function() {
        oldPos = {
              code: 'WFD',
              name: 'Woodford.',
              trains: {
                Westbound: [
                  {
                    id: '1000626',
                    dueIn: '6:00',
                    destination: 'West Ruislip',
                    isStalled: false,
                    location: 'Left Loughton'
                  }
                ]
              }
            };
        newPos = {
              code: 'WFD',
              name: 'Woodford.',
              trains: {
                'Westbound': [
                  {
                    id: '1000626',
                    dueIn: '6:00',
                    destination: 'West Ruislip',
                    isStalled: false,
                    location: 'Left Buckhurt Hill'
                  }
                ]
              }
            };
        out = changePath('', oldPos, newPos);
    });
    describe('when called', function() {


        it('should return the location change', function() {
            out.should.eql([
              {
                name: '.trains.Westbound["1000626"].location',
                parent: '.trains.Westbound["1000626"]',
                property: 'location',
                newValue: 'Left Buckhurt Hill',
                oldValue: 'Left Loughton',
                code: codes.PROP_UPDATE
              }
            ]);
        });
    });
});


