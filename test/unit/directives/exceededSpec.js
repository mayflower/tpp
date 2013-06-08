"use strict";

function logJson(obj) {
  var seen = [];

  console.log(JSON.stringify(obj, function(key, val) {
    if (typeof val == "object") {
      if (seen.indexOf(val) >= 0)
        return '[cyclic]';
      seen.push(val)
    }
    return val
  }));
}

describe('exceeded', function() {
  var scope, $compile, $interpolate;

  beforeEach(module('schnellerApp'));

  beforeEach(inject(function($injector) {
    $compile = $injector.get('$compile');
    $interpolate = $injector.get('$interpolate');
    scope = $injector.get('$rootScope');
  }));

  it('should rule the world', function() {
    var fragment;

    scope.exceededSince = 0;
    fragment = $compile('<exceeded high="0" val="{{exceededSince}}">{{exceededSince}}</exceeded>')(scope)[0];
    scope.$apply();
    expect(fragment.tagName.toLowerCase()).toBe('div');
    expect(fragment.classList.contains('label-warning')).toBeFalsy();

    scope.exceededSince = 1;
    fragment = $compile('<exceeded high="0" val="{{exceededSince}}">{{exceededSince}}</exceeded>')(scope)[0];
    scope.$apply();
    expect(fragment.classList.contains('label-warning')).toBeTruthy();

    logJson($interpolate(fragment.outerHTML)(scope));
  });
});
