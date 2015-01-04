'use strict';

var codes = require('./codes');

var diff = require('./array-diff-converter');


var keysCompare = exports.keysCompare = function(oldKeys, newKeys, newArr, name, changes) {
    var out = diff(oldKeys, newKeys, newArr, name);

    return out;
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
    var oldKeyedObj = oldArr.reduce(function(obj, item) {
        obj[item.id] = item;
        return obj;
    }, {});

    var childrenChanges = [];

    var newKeys = newArr.map(function(item, index) {
        if(oldArr[index] && oldArr[index].id && newArr[index].id) {
            var itemChanges = changePath(name + '[' + index + ']', oldKeyedObj[newArr[index].id], newArr[index], changes);
            childrenChanges.concat(itemChanges);
        }
        return item.id;
    });
    var arrChanges = keysCompare(oldKeys, newKeys, newArr, name, changes);
    return arrChanges.concat(childrenChanges);
};