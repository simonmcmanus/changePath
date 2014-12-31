'use strict';
var changePath = require('../index');

var should = require('should');
var sinon = require('sinon');

describe('When the changePath function is included', function() {
  it('is should return a function', function() {
    (typeof changePath).should.equal('function');
  });

  describe('given two objects containging only strings', function() {
    var obj1;
    var obj2;
    beforeEach(function(done) {
      obj1 = {
        'key': 'value'
      }
      obj2 = {
        'key': 'value'
      }
      done();
    })


    describe(' that contain the same string key values pairs', function() {
      it(' should return an empty array', function() {
        should(changePath('obj', obj1, obj2)).eql([]);
      });
    });

    describe(' that contain string key values pairs of different keys',
      function() {
        var result;

        beforeEach(function() {
          var obj2 = {
            'tea': 'value'
          }
          result = changePath('name', obj1, obj2);
        });
        it('the first item in the changes array should be the deletion', function() {
          should(result[0]).eql({
            change: 'property deleted',
            name: 'name.key',
            parent: 'name',
            property: 'key',
            newValue: null,
            oldValue: 'value'
          });
        });
        it('the second item in the changes array should be the addition of the new key', function() {
          should(result[1]).eql({
            change: 'new property added',
            name: 'name.tea',
            property: 'tea',
            parent: 'name',
            newValue: 'value',
            oldValue: null
          });
        });
      }
    );

    describe('that contain the same keys but different values', function() {

      beforeEach(function() {
        obj2.key = 'something else';
      });

      it(' should report the updated value', function() {
        should(changePath('name', obj1, obj2)[0]).eql({
          change: 'value changed',
          name: 'name.key',
          property: 'key',
          parent: 'name',
          oldValue: 'value',
          newValue: 'something else'
        });
      });
    });

    describe('that contain the same value but are of different types', function() {
      beforeEach(function() {
        obj1.key = 1;
        obj2.key = '1';
      })
      it('should return an value changed', function() {
        should(changePath('name', obj1, obj2)[0]).eql({
          change: 'value changed',
          name: 'name.key',
          oldValue: 1,
          newValue: '1',
          property: 'key',
          parent: 'name'
        });
      });
    });

  });


  describe('Given an object containing the same nested object', function() {
    var obj1;
    var obj2;

    beforeEach(function(done) {
      obj1 = {
        key: {
          harry: 'beagle'
        }
      }
      obj2 = {
        key: {
          harry: 'beagle'
        }
      }
      done();
    });

    it('should return no changes', function() {
      should(changePath('name', obj1, obj2)).eql([]);
    });
  });

  describe('when a nested object property is removed', function() {
    var obj1;
    var obj2;

    before(function(done) {
      obj1 = {
        key: {
          harry: 'beagle',
          bogdan: 'beagle'
        }
      }
      obj2 = {
        key: {
          harry: 'beagle'
        }
      }
      done();
    });

    it('should report the deletion', function() {
      should(changePath('name', obj1, obj2)[0]).eql({
        change: 'property deleted',
        name: 'name.key.bogdan',
        property: 'bogdan',
        parent: 'name.key',

        newValue: null,
        oldValue: 'beagle'
      });
    });
  });

  describe('when a nested object property is added', function() {
    var obj1;
    var obj2;

    before(function(done) {
      obj1 = {
        key: {
          harry: 'beagle',
        }
      }
      obj2 = {
        key: {
          harry: 'beagle',
          bogdan: 'boggy'
        }
      }
      done();
    });

    it('should report the deletion', function() {
      should(changePath('name', obj1, obj2)[0]).eql({
        change: 'new property added',
        name: 'name.key.bogdan',
        newValue: 'boggy',
        property: 'bogdan',
        parent: 'name.key',
        oldValue: null
      });
    });
  });

//   describe('Given two objects', function() {
//     beforeEach(function() {
//       var ob1 = {
//         beagles: [
//           {
//             'key': 'value'
//           },
//           {
//             'key1': 'value1'
//           }
//         ]
//       }
//       var ob2 = {
//         beagles: [
//           {
//             'key': 'value'
//           },
//           {
//             'key1': 'value1'
//           }
//         ]
//       }
//     });
//     describe('which contain the same array of object', function() {
//       it('should return true', function() {
//         should(hasChanged('name', obj1, obj1)).equal(true)
//       });
//     });

//     describe('which contain the same array of object but with a different key', function() {
//       it('should return true', function() {
//         before(function() {
//           delete  obj2.beagles[1].key1;
//           obj2.beagles[1].Ley1 = 'bogs';
//         });
//         should(hasChanged('name', obj1, obj2)).equal(false)
//       });
//     })
//   });

//   describe('Given two objects containing three keys each', function() {
//     var obj1;
//     var obj2;
//     var iterator;
//     before(function(done) {
//       obj1 = {
//         'key': 'value',
//         'key1': 'value',
//         'key2': 'value'
//       }
//       obj2 = {
//         'key': 'value',
//         'key1': 'value',
//         'key2': 'value'
//       }

//       iterator = sinon.spy();
//       hasChanged('name', obj1, obj2, iterator);
//       done();
//     })
//     describe('when called', function() {
//       it('it should call the iterator 3 times.', function() {
//         should(iterator.callCount).equal(3);
//       });
//     });
//   });


//   describe('Given two objects containing three keys each (one of which should fail.)', function() {
//     var obj1;
//     var obj2;
//     var iterator;
//     before(function(done) {
//       obj1 = {
//         'key': 'value',
//         'key1': 'value',
//         'asdkey2': 'value'
//       }
//       obj2 = {
//         'key': 'value',
//         'key1': 'value',
//         'key2': 'value'
//       }

//       iterator = sinon.spy();
//       hasChanged('name', obj1, obj2, iterator);
//       done();
//     })
//     describe('when called', function() {
//       it('it should call the iterator 3 times.', function() {
//         should(iterator.callCount).equal(3);
//       });
//     });
//   });


//   describe('given an iterator function', function() {

//     describe('Given two objects containing one key value fail which fails', function(done) {
//       var obj1;
//       var obj2;
//       before(function(done) {
//         obj1 = {
//           'key': 'value'
//         }
//         obj2 = {
//           'asdkey2': 'value'
//         }

//         iterator = sinon.spy();

//         hasChanged('name', obj1, obj2, iterator);
//         done();
//       })
//       describe('when called', function() {
//         it('should pass the iterator the reasons for failure.', function() {
//           should(iterator.calledWith(obj1, obj2, 'key', 'Expected object key `key` to exist.', 'name')).equal(true);
//         });
//       });
//     });


//     describe('given two objects containing nested objects.', function() {

//       var obj1;
//       var obj2;
//       var iterator;

//       before(function(done) {

//         obj1 = {
//           key: {
//             bacon: {
//               'cat': 'tiger'
//             }
//           }
//         };
//         obj2 = {
//           key: {
//             bacon: {
//               'cat': 'tiger'
//             }
//           }
//         };
//         iterator = sinon.spy();
//         hasChanged('starting', obj1, obj2, iterator);
//         done();
//       });

//       describe('when hasChanged is called', function() {
//         it('iterator should get called once as only one key/value pair is compared', function() {
//           should(iterator.callCount).equal(1);
//         });
//         it('should pass in the object path of the keys on failure and success', function() {
//           should(iterator.calledWith(obj1.key.bacon, obj2.key.bacon, 'cat', false, 'starting.key.bacon')).equal(true);
//         });
//       });
//     });

//     describe('given two objects containing an array of objects.', function() {

//       var obj1;
//       var obj2;
//       var iterator;

//       before(function(done) {

//         obj1 = {
//           key: [
//             {
//               dog: 'beagle'
//             }
//           ]
//         };
//         obj2 = {
//           key: [
//             {
//               dog: 'beagle'
//             }
//           ]
//         };

//         iterator = sinon.spy();
//         hasChanged('starting', obj1, obj2, iterator);
//         done();
//       });

//       describe('when hasChanged is called', function() {
//         it('iterator should get called once as there is one key/value comparisons', function() {
//           should(iterator.callCount).equal(1);
//         });
//         it('should pass in the object path of the keys on failure and success.', function() {
//           should(iterator.calledWithExactly(obj1.key[0], obj2.key[0], 'dog', false, 'starting.key[0]')).equal(true);
//         });
//       });
//     });
//   });
});
