'use strict';

var keysCompare = exports.keysCompare = function(oldKeys, newKeys, name) {
    console.log(oldKeys);
    console.log(newKeys);
    var changes = [];
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
                changes.push({
                    name: name + '[' + newPos + ']',
                    change: 'new item added to list',
                    newValue: newKeys[newPos],
                    position: newPos
                });
                offset ++;
            }else if(!deleted[oldKeys[a]]) {
                // item moved.
                changes.push({
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

exports.objCompare = function(oldArr, newArr, name, changePath) {

    var oldObj = {};
    var newObj = {};

    var oldKeys = oldArr.map(function(item) {
        oldObj[item.id] = item;
        return item.id;
    });

    var childrenChanges = [];

    var newKeys = newArr.map(function(item, index) {
        childrenChanges = childrenChanges.concat(changePath(name + '[' + index + ']', oldArr[index], newArr[index], null, []));
        return item.id;
    });
    console.log('ret');
    return keysCompare(oldKeys, newKeys, name).concat(childrenChanges);

};