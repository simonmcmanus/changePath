// deffo not the most efficient way to do it but makes it easier to read.



// // // swapped
// var oldArr = ['a', 'b', 'c'];
// var newArr = ['a', 'c', 'b'];

// // // // swapped
// var oldArr = ['a', 'b', 'c'];
// var newArr = ['b', 'a', 'c'];


// // // moved to the end
// var oldArr = ['a', 'b', 'c'];
// var newArr = ['b', 'c', 'a'];


// // last item moved first
// var oldArr = ['a', 'b', 'c'];
// var newArr = ['c', 'a', 'b'];


var newObj = newArr.reduce(function(obj, key, index) {
    obj[key] = index;
    return obj;
}, {});


var oldObj = oldArr.reduce(function(obj, key, index) {
    obj[key] = index;
    return obj;
}, {});



newArr.reduce(function(offset, id, index) {

    var currentIndex = index - offset;
        console.log('----------------------------------------------------------------------------------------');
        console.log('CurrentIndex:', currentIndex);
        console.log('Real Index', index);
    //var currentOffset = index + offset;
    

    var oldPosOfId = oldObj[id];

    console.log('ID', id, currentIndex, oldObj[id]);

  



    if(offset !== oldObj[id]) {
        
        if(oldArr[newObj[id]] === newArr[currentIndex]) {
            console.log(id, 'swapped', offset, newObj[id])
        }else {
            console.log(id, 'moved', offset, newObj[id])
        }
    }

    if(oldPosOfId > index) {
        offset ++;
    }

    console.log('----------------------------------------------------------------------------------------');

    return offset;
}, 0);




console.log(oldObj, newObj);