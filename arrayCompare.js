'use strict';

var codes = require('./codes');

var keysCompare = exports.keysCompare = function(oldKeys, newKeys, newArr, name, changes) {
    changes = changes || [];
    var changesObj = {};
    var objs = {
        old: {},
        latest: {}
    };

    newKeys.forEach(function(item, index) {
        objs.latest[item] = index;
    });

    var deleted = {};

    oldKeys.forEach(function(item, index) {

        if(newKeys.indexOf(item) === -1) {
            deleted[item] = true;
            changes.push({
                parent: name,
                name: name + '[' + index + ']',
                change: codes.ITEM_DELETE,
                item: item
            });
        }
    });

    // keep track when new items added to the start of the array so all
    // the items pushed down in the array are not classed as moved.
    var offset = 0;
    for(var a = 0; a < newKeys.length; a++) {

        var newPos = a + offset;
        if(newKeys[newPos] !== oldKeys[a]) {

            if(deleted[oldKeys[a]]) {
                offset --;
            }
            // todo - remove indexOf here.
            var oldPos = oldKeys.indexOf(newKeys[newPos]);
            if(oldPos === -1 && newKeys[newPos]) {
                console.log('new item added to list', newArr, newPos);
                changes.push({
                    parent: name,
                    name: name + '[' + newPos + ']',
                    change: codes.ITEM_CREATE,
                    newValue: newArr[newPos],
                    position: newPos
                });
                offset ++;
            }else if(!deleted[oldKeys[a]]) {

                var changeName = name + '[' + a + ']';

                if(changesObj[newPos] && changesObj[newPos].oldPosition === newPos) {
                console.log('GOT A SWAP', changesObj[newPos], oldPos, newKeys[newPos]);

                    var change = {
                        parent: name,
                        change: codes.ITEMS_SWAPPED,
                        changes: {}
                    };

                    change.changes[changesObj[newPos].id] = {
                        oldPos: changesObj[newPos].oldPosition,
                        newPos: changesObj[newPos].newPosition
                    };

                    delete changesObj[oldPos];

                    change.changes[newKeys[newPos]] = {
                        oldPos: oldPos,
                        newPos: a
                    };
                    changes.push(change);
                } else {
                    console.log('GOT A MOVE', newKeys[newPos], oldPos);
                    // looks like a move, but add to the changes obj so we
                    // can check for it being swapped with another item.
                    changesObj[oldPos] = {
                        parent: name,
                        name: changeName,
                        change: codes.ITEM_MOVE,
                        id: newKeys[newPos],
                        newPosition: a,
                        oldPosition: oldPos
                    };
                }

                // need to push out the remains of: changesObj
                changes.push();
            }
        }
    }
    // push anything left in changes object onto the changes array.
    return changes;
};








/**
 * Take two arrays of objects (each object needs an id),
 * and strips to array of ids which can be passed to keysCompare
 **/
exports.objCompare = function(name, oldArr, newArr, changes, changePath) {
    // needs to ensure we only let in arrays that contain an id.
    // needs to report on values changed in the array
    // needs to report on values changed on nested objects.
    // when comparing old and new needs to account for items which have moved.
    // needs to add changes in children objects

    var oldKeys = oldArr.map( function(item) { return item.id; } );

    var childrenChanges = [];

    var newKeys = newArr.map(function(item, index) {
        if(oldArr[index] && oldArr[index].id === newArr[index].id) {
            var itemChanges = changePath(name + '[' + index + ']', oldArr[index], newArr[index], changes);
            childrenChanges.concat(itemChanges);
        }
        return item.id;
    });
    var arrChanges = keysCompare(oldKeys, newKeys, newArr, name, changes);
    return arrChanges.concat(childrenChanges);
};