'use strict';

var hasChanged = require('../index.js');
var should = require('should');

var codes = require('../codes');


var arrayCompare = require('../arrayCompare');

describe('when the module is included', function() {
    var out;
    var oldArr;
    var newArr;

    it('is should return a function', function() {
      (typeof arrayCompare.keysCompare).should.equal('function');
    });


    describe('when an item is removed from the start of an array', function() {
        beforeEach(function() {
            oldArr = ['a', 'b', 'c', 'd', 'e'];
            newArr = ['b', 'c', 'd', 'e'];
            out  = arrayCompare.keysCompare(oldArr, newArr, {}, 'start');
        });
        it('should report that the item has been removed', function() {
            should(out).eql([{
                code: codes.ITEM_DELETE,
                item: 'a',
                name: 'start["a"]',
                parent: 'start'
            }]);
        });
    });

    describe('when two items are removed from the start an array', function() {
        var out;
        before(function() {
            oldArr = ['a', 'b', 'c', 'd', 'e'];
            newArr = [ 'c', 'd', 'e'];
            out  = arrayCompare.keysCompare(oldArr,newArr, {}, 'start');
        });
        it('should report that the item has been removed', function() {
            should(out).eql([
                {
                    code: codes.ITEM_DELETE,
                    item: 'a',
                    name: 'start["a"]',
                    parent: 'start'
                },
                {
                    code: codes.ITEM_DELETE,
                    item: 'b',
                    name: 'start["b"]',
                    parent: 'start'
                }
            ]);
        });
    });



    describe('when an item is removed from the middle of an array', function() {
        var out;
        beforeEach(function() {
            oldArr = [1, 2, 3, 4, 5];
            newArr = [1, 2, 4, 5];
            out  = arrayCompare.keysCompare(oldArr,newArr, {}, 'start');
        });
        it('should report that the item has been removed', function() {
            should(out).eql([{
                code: codes.ITEM_DELETE,
                item: 3,
                name: 'start["3"]',
                parent: 'start'
            }]);
        });
    });




    describe('when an item is removed from the end of an array', function() {
        var out;
        beforeEach(function() {
            oldArr = [1, 2, 3, 4, 5];
            newArr = [1, 2, 3, 4];
            out  = arrayCompare.keysCompare(oldArr,newArr, {}, 'start');
        });
        it('should report that the item has been removed', function() {
            should(out).eql([{
                code: codes.ITEM_DELETE,
                item: 5,
                name: 'start["5"]',
                parent: 'start',
            }]);
        });
    });


    describe('when an item is added to the start of an array', function() {
        var out;
        beforeEach(function() {
            oldArr = [1, 2, 3, 4, 5];
            newArr = [6, 1, 2, 3, 4, 5];
            out  = arrayCompare.keysCompare(oldArr,newArr, newArr, 'start');
        });
        it('should report that the item has been added', function() {
            should(out).eql([{
                code: codes.ITEM_CREATE,
                name: 'start["6"]',
                position: 0,
                item: 6,
                newValue: 6,
                parent: 'start'
            }]);
        });
    });


    describe('when an item is added to the middle of an array', function() {
        var out;
        beforeEach(function() {
            oldArr = [1, 2, 3, 4, 5];
            newArr = [ 1, 2, 6, 3, 4, 5];
            out  = arrayCompare.keysCompare(oldArr,newArr, newArr, 'start');
        });
        it('should report that the item has been added', function() {
            should(out).eql([{
                code: codes.ITEM_CREATE,
                newValue: 6,
                item:6,
                name: 'start["6"]',
                position: 2,
                parent: 'start'
            }]);
        });
    });



    describe('when an item is added to the end of an array', function() {
        var out;
        beforeEach(function() {
            oldArr = [1, 2, 3, 4, 5];
            newArr = [1, 2, 3, 4, 5, 6];
            out  = arrayCompare.keysCompare(oldArr,newArr, newArr, 'start');
        });
        it('should report that the item has been added', function() {
            should(out).eql([{
                code: codes.ITEM_CREATE,
                position: 5,
                item:6,
                newValue: 6,
                name: 'start["6"]',
                parent: 'start'
            }]);
        });
    });

    describe('when the last two letters are swapped.', function() {
        var out;
        beforeEach(function() {
            oldArr = ['a', 'b', 'c', 'd', 'e'];
            newArr = ['a', 'b', 'c', 'e', 'd'];
            out  = arrayCompare.keysCompare(oldArr,newArr, newArr, 'start');
        });
        it('should report that the two items have been swapped over', function() {
            should(out).eql([{
                code: codes.ITEM_MOVE,
                item: 'd',
                name: 'start["d"]',
                newPosition: 4,
                originalPosition: 3,
                parent: 'start'
            }]);
        });
    });

    describe('when the first two letters are swapped.', function() {
        var out;
        beforeEach(function() {
            oldArr = ['a', 'b', 'c', 'd', 'e'];
            newArr = ['b', 'a', 'c', 'd', 'e'];
            out  = arrayCompare.keysCompare(oldArr,newArr, {}, 'start');
        });
        it('should report that the item have been swapped', function() {

            // should(out).eql([{
            //     parent: 'start',
            //     change: codes.ITEMS_SWAPPED,
            //     changes: {
            //         a: {
            //             newPos: 1,
            //             oldPos: 0
            //         },
            //         b: {
            //             newPos: 0,
            //             oldPos: 1
            //         }
            //     }
            // }]);
        });
    });


    describe('when one item is added an another removed', function() {
        beforeEach(function() {
            oldArr = ['north', 'south'];
            newArr = ['north', 'west'];
            out  = arrayCompare.keysCompare(oldArr,newArr, newArr, 'start');
        });
        it('should report the remove of the item', function() {
            out[0].should.eql({
                code: codes.ITEM_DELETE,
                item: 'south',
                name: 'start["south"]',
                parent: 'start'
            });

        });
        it('should also report the addition of the new item.', function() { 
            out[1].should.eql({
                code: codes.ITEM_CREATE,
                name: 'start["west"]',
                item: 'west',
                position: 1,
                newValue: 'west',
                parent: 'start'
            });

        });
    });


    describe('When the first item is moved to the end', function() {
        beforeEach(function() {
            oldArr = ['a', 'b', 'c', 'd', 'e'];
            newArr = ['b', 'c', 'd', 'e', 'a'];
            out = arrayCompare.keysCompare(oldArr,newArr, newArr, 'start');
        });
        it('should report the move', function() {
            out[0].should.eql({
                name: 'start["a"]',
                parent: 'start',
                code: 'ITEM_MOVE',
                item: 'a',
                originalPosition: 0,
                newPosition: 4
            })
        });
        it('should only report the move', function() {
            out.length.should.equal(1);
        });
    });





//     console.log('---> change first two numbers');
//     oldArr = [1, 2, 3, 4, 5];
//     newArr = [2, 1, 3, 4, 5];
//     arrayCompare(oldArr,newArr );
 })