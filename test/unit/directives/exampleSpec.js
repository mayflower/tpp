"use strict";

ddescribe('example directive', function() {
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

  it('@scopes', function() {
    var watchCalls = 0;

    directive('example', function() {
      return {
        scope: {
          //atScope: '@at-isolated', Error: Invalid isolate scope definition for directive example: @at-isolated
          atIsolated: '@isolated',
          atInterpolated: '@interpolated'
        },
        link: function(scope, element, attributes) {
          expect(scope.atIsolated).toBeUndefined();
          expect(scope.atInterpolated).toBeUndefined();

          scope.$watch('atInterpolated', function(newVal, oldVal) {
            watchCalls++;
            if (1 == watchCalls) {
              expect(newVal).toBe(oldVal);
              expect(newVal).toBe('1');
            }
            if (2 == watchCalls) {
              expect(oldVal).toBe('1');
              expect(newVal).toBe('2');
            }
          });

          scope.$apply();
          expect(watchCalls).toBe(1);

          expect(scope.atIsolated).toBe('iso.foo');
          expect(scope.atInterpolated).toBe('1');
        }
      }
    });
    rootScope.$apply('iso.foo = 1');
    compile('<one isolated="iso.foo" interpolated="{{iso.foo}}" example>')(rootScope);
    rootScope.$apply('iso.foo = 2');
    expect(watchCalls).toBe(2);
  });
});
