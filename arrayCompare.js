'use strict';

var keysCompare = exports.keysCompare = function(oldKeys, newKeys, newArr, name, changes) {
    changes = changes || [];
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
                change: 'item removed from list',
                item: item
            });
        }
    });

    var offset = 0; // keep track when new items added to the start of the array so all the items pushed down in the array are not classed as moved.
    for(var a = 0; a < newKeys.length; a++) {

        var newPos = a + offset;
        if(newKeys[newPos] !== oldKeys[a]) {

            if(deleted[oldKeys[a]]) {
                offset --;
            }

            var oldPos = oldKeys.indexOf(newKeys[newPos]);
            if(oldPos === -1 && newKeys[newPos]) {
                console.log('new item added to list', newArr, newPos);
                changes.push({
                    parent: name,
                    name: name + '[' + newPos + ']',
                    change: 'new item added to list',
                    newValue: newArr[newPos],
                    position: newPos
                });
                offset ++;
            }else if(!deleted[oldKeys[a]]) {

                // if items have been swapped over.

                // item moved.
                console.log('item moved in list');
                changes.push({
                    parent: name,
                    name: name + '[' + a + ']',
                    change: 'item moved in list',
                    newPosition: a,
                    oldPosition: oldPos
                });
            }
        }
    }
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
// need to take account of the offset no?
// 
    var arrChanges = keysCompare(oldKeys, newKeys, newArr, name, changes);
    return arrChanges.concat(childrenChanges);

};