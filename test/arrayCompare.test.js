'use strict';

var hasChanged = require('../index.js');
var should = require('should');
var sinon = require('sinon');

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
        before(function() {
            oldArr = [1, 2, 3, 4, 5];
            newArr = [2, 3, 4, 5];
            out  = arrayCompare.keysCompare(oldArr, newArr, {}, 'start');
        });
        it('should report that the item has been removed', function() {
            should(out).eql([{
                change: codes.ITEM_DELETE,
                item: 1,
                name: 'start[0]',
                parent: 'start'
            }]);
        });
    });

    describe('when two items are removed from the start an array', function() {
        var out;
        before(function() {
            oldArr = [1, 2, 3, 4, 5];
            newArr = [ 3, 4, 5];
            out  = arrayCompare.keysCompare(oldArr,newArr, {}, 'start');
        });
        it('should report that the item has been removed', function() {
            should(out).eql([
                {
                    change: codes.ITEM_DELETE,
                    item: 1,
                    name: 'start[0]',
                    parent: 'start'
                },
                {
                    change: codes.ITEM_DELETE,
                    item: 2,
                    name: 'start[1]',
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
                change: codes.ITEM_DELETE,
                item: 3,
                name: 'start[2]',
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
                change: codes.ITEM_DELETE,
                item: 5,
                name: 'start[4]',
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
                change: codes.ITEM_CREATE,
                newValue: 6,
                name: 'start[0]',
                position: 0,
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
                change: codes.ITEM_CREATE,
                newValue: 6,
                name: 'start[2]',
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
                change: codes.ITEM_CREATE,
                newValue: 6,
                position: 5,
                name: 'start[5]',
                parent: 'start'
            }]);
        });
    });

    // we need to make sure this reports something sensible.
    // oldArr = ['a', 'b', 'c', 'd', 'e'];
    // newArr = ['b', 'c', 'd', 'e', 'a'];


    describe('when the last two numbers are changed.', function() {
        var out;
        beforeEach(function() {
            oldArr = ['a', 'b', 'c', 'd', 'e'];
            newArr = ['a', 'b', 'c', 'e', 'd'];
            out  = arrayCompare.keysCompare(oldArr,newArr, newArr, 'start');
            console.log(out);
        });
        it('should report that the two items have been swapped over', function() {
            should(out).eql([{
                change: codes.ITEMS_SWAPPED,
                changes: {
                    d: {
                        oldPos: 3,
                        newPos: 4
                    },
                    e: {
                        oldPos: 4,
                        newPos: 3
                    }
                },
                parent: 'start',
            }]);
        });
    });



    describe('when the first two numbers are changed.', function() {
        var out;
        beforeEach(function() {
            oldArr = [1, 2, 3, 4, 5];
            newArr = [2, 1, 3, 4, 5];
            out  = arrayCompare.keysCompare(oldArr,newArr, {}, 'start');
        });
        // it('should report that the item has been added', function() {
        //     should(out).eql([{
        //         change: "new item added to list",
        //         item: 6,
        //         name: "start[5]"
        //     }]);
        // });
    });


    describe('when one item is added an another removed', function() {
        beforeEach(function() {
            oldArr = ['north', 'south'];
            newArr = ['north', 'west'];
            out  = arrayCompare.keysCompare(oldArr,newArr, newArr, 'start');
        });
        it('should report the remove of the item', function() {
            out[0].should.eql({
                change: codes.ITEM_DELETE,
                item: 'south',
                name: 'start[1]',
                parent: 'start'
            });

        });
        it('should also report the addition of the new item.', function() { 
            out[1].should.eql({
                change: codes.ITEM_CREATE,
                newValue: 'west',
                name: 'start[1]',
                position: 1,
                parent: 'start'
            });

        });
    })



//     console.log('---> change first two numbers');
//     oldArr = [1, 2, 3, 4, 5];
//     newArr = [2, 1, 3, 4, 5];
//     arrayCompare(oldArr,newArr );
 })