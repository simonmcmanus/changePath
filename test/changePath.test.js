'use strict';
var changePath = require('../index');

var should = require('should');
var sinon = require('sinon');

var codes = require('../codes');

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
            change: codes.PROP_DELETE,
            name: 'name.key',
            parent: 'name',
            property: 'key',
            newValue: null,
            oldValue: 'value'
          });
        });
        it('the second item in the changes array should be the addition of the new key', function() {
          should(result[1]).eql({
            change: codes.PROP_CREATE,
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
          change: codes.PROP_UPDATE,
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
          change: codes.PROP_UPDATE,
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
        change: codes.PROP_DELETE,
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
        change: codes.PROP_CREATE,
        name: 'name.key.bogdan',
        newValue: 'boggy',
        property: 'bogdan',
        parent: 'name.key',
        oldValue: null
      });
    });
  });

});
