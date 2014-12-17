#ChangePath

WIP. Not ready for use.

Given two objects, check for changes and report back the differences.


##Usage:
```
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
