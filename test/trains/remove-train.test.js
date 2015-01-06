'use strict';

// some project specific data that I needed to make sure was working.
var changePath = require('../../index');
var should = require('should');
var codes = require('../../codes');

describe('given a train which has been removed', function() {

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
                  },
                  {
                    'id': '10006261',
                    'dueIn': '6:00',
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
                code: codes.ITEM_DELETE,
                item: '10006261',
                parent: '.trains.Westbound',
                name: '.trains.Westbound["10006261"]'
              }
            ]);
        });
    });
});
