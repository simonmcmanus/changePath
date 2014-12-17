'use strict';

var _ = require('lodash');

var arrayCompare = require('./arrayCompare');

/**
 * Compare two objects, for structure, and types of the values.
 * @param  {String} name     Name, usually the name of the objects you are comparing.
 * @param  {Object} obj      The first object
 * @param  {Object} obj1     The second object
 * @param  {Function} iterator A function to be called on each comparison.
 * @return {Boolean}          Do the two objects have the same structure and types?
 */
var changePath = module.exports = function(name, oldData, newData, changeEmitter, changes) {

    changes = changes || [];

    changeEmitter = function(name, change, newValue, oldValue) {
        changes.push({
            name: name,
            newValue: newValue,
            oldValue: oldValue,
            change: change
        });
    };
    for(var oldItem in oldData) {
        if(typeof newData[oldItem] === 'undefined') {
            changeEmitter(name + '.' + oldItem, 'property deleted', null, oldData[oldItem]);
        }
    }
    for(var item in newData) {

        if(typeof oldData[item] === 'undefined') {
            changeEmitter(name + '.' + item, 'new property added', newData[item], null);
            continue;
        }
        switch(typeof newData[item]) {
            case 'object':
                if(newData[item] instanceof Array) {
                    changes.push(arrayCompare.objCompare(oldData[item], newData[item], name + '.' + item,changePath));
                } else {
                    var objChanges = changePath(name + '.' + item, oldData[item], newData[item], null, changes);

                }
                break;
            case 'string':
                if(item != 'id' && oldData[item] !== newData[item]) {
                    changeEmitter(name+ '.' + item, 'value changed', oldData[item], newData[item]);
                }
                continue;
            case 'number':
                if(oldData[item] != newData[item]) {
                    changeEmitter(name+ '.' + item, 'number changed', oldData[item], newData[item]);
                }
                continue;
        }
    }

    return changes;
};
