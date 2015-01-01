#ChangePath


WIP. Not ready for use.

Given two objects, check for changes and report back the differences.


##Origin

Designed to make responding to data changes particuarly easy at the most granular level.

Im my case when a user connects they are given the cached data, the next time the JSON api is polled the two versions are compared with changePath, relevant changes are then sent out over websokets to the  user.

The idea being to ensure the user is always looking at the latest data but minimise data being sent over the wire.

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

// would result in a new item added: 



```


#Change Codes

PROP_ADD
PROP_DELETE
STR_CHANGE
INT_CHANGE

ITEMS_SWAPPED
ITEM_ADD
ITEM_DELETE
ITEM_MOVE


#TODO

ARRAY_PROP_CHANGE
TYPE CHANGE



* New property added
* Property removed
* List item added
* List item removed
* List item moved
* List items  swapped