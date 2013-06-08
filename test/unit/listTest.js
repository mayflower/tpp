describe('the listCtrl', function() {
  var scope, ctrl;

  beforeEach(module('schnellerApp'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('listCtrl', {$scope: scope});
  }));

  it('should have list and criteria properties', function() {
    expect(scope.list).toEqual(jasmine.any(Array));
    expect(scope.criteria).toBe('ipid');
  });

  describe('sort', function() {
    it('should set criteria', function() {
      scope.sort('foo');
      expect(scope.criteria).toBe('foo');
    });

    it('should prefix criteria when called twice with same param', function() {
      scope.sort('foo');
      scope.sort('foo');
      expect(scope.criteria).toBe('-foo');
      scope.sort('bar');
      expect(scope.criteria).toBe('bar');
    });
  });
});
