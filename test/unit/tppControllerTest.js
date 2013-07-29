describe('the tppController', function () {
  var scope, controller;

  beforeEach(module('tppApp'));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    controller = $controller('tppController', {$scope: scope});
  }));

  it('should have list and criteria properties', function () {
    expect(scope.memberList).toEqual(jasmine.any(Array));
    expect(scope.sortCriteria).toBe('name');
  });

  describe('sortListBy', function () {

    it('should set sort criteria', function () {
      scope.sortListBy('foo');
      expect(scope.sortCriteria).toBe('foo');
    });

    it('should prefix sort criteria with "-" when called twice with same param', function () {
      scope.sortListBy('foo');
      expect(scope.sortCriteria).toBe('foo');

      scope.sortListBy('foo');
      expect(scope.sortCriteria).toBe('-foo');

      scope.sortListBy('foo');
      expect(scope.sortCriteria).toBe('foo');
    });

  });
});
