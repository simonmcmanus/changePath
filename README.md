#ChangePath

[![Greenkeeper badge](https://badges.greenkeeper.io/simonmcmanus/changePath.svg)](https://greenkeeper.io/)


WARNING: EXPERIMENTAL MODULE

CODE IS TERRIBLY INEFFICIENT. JUST A POC.

Given two objects, check for changes and report back the differences.

[![Build Status](https://travis-ci.org/simonmcmanus/changePath.svg?branch=master)](https://travis-ci.org/simonmcmanus/changePath)


##Origin

Designed to make responding to data changes particuarly easy at the most granular level.

Im my case when a user connects they are served the cached data (as html), the next time the JSON api is polled the two versions are compared with changePath, relevant changes are then sent out over websokets.

The intention being to ensure the user is always looking at the latest data but minimise data being sent over the wire.

##Install

npm install changePath

##Usage

The change path function only expects two objects.

```
    changePath = require('changePath');

    var obj1 = {
        foo: 'bar'
    };

    var obj2 = {
        foo: 'bar',
        baz: 'cheese'
    }

    var results = changePath('obj2', obj1, obj2);

    //results = [
    //    {
    //      change: 'new property added',
    //      name: 'obj2.baz',
    //      newValue: 'cheese',
    //      oldValue: null
    //    }
    //];
```


#Arrays
Change path will report changes to an array of objects just so long as the items have an unique id property. Eg:

```
var oldData = {
    cheese: [
        {
            id: 1,
            name: 'Brie'
        }
    ]
}

var newData = {
    cheese: [
        {
            id: 1,
            name: 'Brie'
        },
        {
            id: 2,
            name: 'Red Leicester'
        }
    ]
}

var results = changePath('newData', oldData, newData);



```


##Change Codes

###Objects

The following changes codes would be reported against an object:

* PROP_CREATE
A new property has been added to an object.

* PROP_UPDATE
The value of a property has changed.

* PROP_DELETE
A property no longer exists.

###Arrays

The following change codes would be reports against an array:

* ITEM_CREATE
A new item has been added to the array.

* ITEM_DELETE
An item has been removed from an array.

* ITEM_MOVE
An items position in the array has changed. When new items are added/removed from the start of an array the offset is considered so the other items in the array should not report being moved.

* ITEMS_SWAPPED
Two items in the list have change position


#TODO
* Simple arrays
* TYPE_CHANGE
