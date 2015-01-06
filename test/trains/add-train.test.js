// some project specific data that I needed to make sure was working. 
var changePath = require('../../index');

var should = require('should');

var codes = require('../../codes');


describe('add-train', function() {
  describe('given a new train being added', function() {
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
                  Westbound: [
                    {
                      id: '1000626',
                      dueIn: '6:00',
                      destination: 'West Ruislip',
                      isStalled: false,
                      location: 'Left Loughton'
                    },
                    {
                      id: '321',
                      dueIn: '6:00',
                      destination: 'West Ruislip',
                      isStalled: false,
                      location: 'Left Loughton'
                    }
                  ]
                }
              };
          out = changePath('', oldPos, newPos);
      });
      describe('when called', function() {
          it('should report the addition', function() {
              should(out).eql([
                {
                  name: '.trains.Westbound["321"]',
                  code: codes.ITEM_CREATE,
                  item: "321",
                  newValue: {
                      id: '321',
                      dueIn: '6:00',
                      destination: 'West Ruislip',
                      isStalled: false,
                      location: 'Left Loughton'
                  },
                  parent: '.trains.Westbound',
                  position: 1
                }
              ]);
          });
      });
  });
});



