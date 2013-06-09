"use strict";

describe('example directive', function() {
  var rootScope, compile, interpolate, directive;

  angular.module('exampleModule', []);

  beforeEach(module('exampleModule', function($compileProvider) {
    directive = $compileProvider.directive;
  }));

  beforeEach(inject(function($injector) {
    compile = $injector.get('$compile');
    rootScope = $injector.get('$rootScope');
    interpolate = $injector.get('$interpolate');
  }));

  it('should inherit parent scope when property scope is not an object', function() {
    directive('example', function() {
      return {
        //scope: no scope property
        link: function(scope, element, attributes) {
          expect(scope.foo.bar).toBe(1);
          expect(scope.$eval('foo.bar')).toBe(1);
          scope.$apply('foo.bar = 42');
          expect(rootScope.foo.bar).toBe(42);
        }
      }
    });
    rootScope.$apply('foo.bar = 1');
    compile('<one example>')(rootScope);
  });

  it('must not inherit parent scope when property scope is an object', function() {
    directive('example', function() {
      return {
        scope: {},
        link: function(scope, element, attributes) {
          expect(scope.foo).toBeUndefined();
          expect(scope.$eval('foo.bar')).toBeUndefined();
          scope.$apply('foo.bar = 42');
          expect(rootScope.foo.bar).toBe(1);
        }
      }
    });
    rootScope.$apply('foo.bar = 1');
    compile('<one example>')(rootScope);
  });
});
