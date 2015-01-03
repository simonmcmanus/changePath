
var _ = require('lodash');

var diff = require('array-diff')({
    unique: true,
    compress: true,
});


var codes = require('./codes');


function toObj(obj, item, index) {
    obj[item] = index;
    return obj;
};


// WHAT HAPOEN IF AN ARRAY IS MOVED AND
// THE DATA IS ALSO CHANFGED
//
//  - confirm behaviour. !?>!>!>!?!?!?!


// compares two arrays - mainly deals with converting
// the format from array diff.
// massively inefficiely but just a proof of concept atm.
var d = module.exports = function(oldArr, newArr, CompleteObj, name) {
    var difference = diff(oldArr, newArr);
    var oldObj = oldArr.reduce(toObj, {});
    var newObj = newArr.reduce(toObj, {});


    var process = function(items, data) {
        var changes = [];
        items.forEach(function(i) {
            var newData = _.clone(data);
            newData.item = i;
            switch(data.code) {
                case codes.ITEM_DELETE:
                    newData.name = name + '[' + oldObj[i] + ']';
                break;
                case codes.ITEM_CREATE:
                    newData.name = name + '[' + newObj[i] + ']';
                    newData.position = newObj[i];
                break;
                case codes.ITEM_MOVE:
                    newData.name = name + '[' + oldObj[i] + ']';
                    newData.originalPosition = cuts[i];
                    newData.newPosition = newObj[i];
                break;
            }
            changes.push(newData);
        });
        return changes;
    };


    var cuts = difference.reduce(function(cuts, item) {
        if (item[0] === 'x') {
            item[1].forEach(function(i) {
               cuts[i] = oldObj[i];
            });
        }
        return cuts;
    }, {});

    var changes = [];

    difference.forEach(function(item) {
        if(item[0] === '-') {
            var deletions = process(item[1], {
                parent: name,
                code: codes.ITEM_DELETE
            });
            changes = changes.concat(deletions);
        } else if (item[0] === '+') {
            var creations = process(item[1], {
                parent: name,
                code: codes.ITEM_CREATE
            });
            changes = changes.concat(creations);
        } else if(item[0] === 'p') {
            var pastes = process(item[1], {
                parent: name,
                code: codes.ITEM_MOVE,
            });

            changes = changes.concat(pastes);
        }
    });
    return changes;
};










// oldArr = ['a', 'b', 'c', 'd', 'e'];
// newArr = ['b', 'c', 'd', 'e', 'a'];




// console.log(d(oldArr, newArr));



// // // swapped
// var oldArr = ['a', 'b', 'c'];
// var newArr = ['b', 'a', 'c'];

// // // swapped
// var oldArr = ['a', 'b', 'c'];
// var newArr = ['a', 'c', 'b'];


// // // moved to the end
// var oldArr = ['a', 'b', 'c'];
// var newArr = ['b', 'c', 'a'];


// // last item moved first
// var oldArr = ['a', 'b', 'c'];
// var newArr = ['c', 'a', 'b'];


// // // swapped
// var oldArr = ['a', 'b', 'c', 'd', 'e'];
// var newArr = ['b', 'a', 'c', 'e', 'd'];

