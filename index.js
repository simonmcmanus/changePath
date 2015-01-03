'use strict';

var _ = require('lodash');

var arrayCompare = require('./arrayCompare');

var codes = require('./codes');

// add a single change to the change array.
var changeEmitter = function(name, key, change, oldValue, newValue, changes) {
    //  name.replace(/\[[1-9]]/g, '[*]')
    changes.push({
        property: key,
        name: name + '.' + key,
        parent: name,
        newValue: newValue,
        oldValue: oldValue,
        change: change
    });
};

// adds array of changes to the existing changes array.
function pushChanges(changes, newChanges) {
    Array.prototype.push.apply(changes, newChanges);
};

/**
 * Compare two objects, for structure, and types of the values.
**/
var changePath = module.exports = function(name, oldData, newData, changes) {

    changes = changes || [];

    for(var oldItem in oldData) {
        if(typeof newData[oldItem] === 'undefined') {
            // todo - proto check here.
            changeEmitter(name, oldItem, codes.PROP_DELETE, oldData[oldItem], null, changes);
        }
    }

    for(var item in newData) {
        objProperty(name, item, oldData, newData, changes);
    }
    return changes;
};




function objProperty(name, item, oldData, newData, changes) {
    if(!oldData || typeof oldData[item] === 'undefined') {
        changeEmitter(name, item, codes.PROP_CREATE, null, newData[item], changes);
    } else {
        switch(typeof newData[item]) {
            case 'object':
                if(newData[item] instanceof Array) {
                    var arrayChanges = arrayCompare.objCompare(name + '.' + item, oldData[item], newData[item], changes, changePath);
                    pushChanges(changes, arrayChanges);

                } else {
                    changePath(name + '.' + item, oldData[item], newData[item], changes);
                }
                break;
            default:
                if(oldData[item] !== newData[item]) {
                    changeEmitter(name, item, codes.PROP_UPDATE, oldData[item], newData[item], changes);
                }
        }
    }
    return changes;
}
