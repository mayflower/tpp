describe('the listCtrl', function() {
  var scope, ctrl;

  beforeEach(module('schnellerApp'));

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('listCtrl', {$scope: scope});
  }));

  it('should expect that true is true', function() {
    expect(scope.list).toEqual(jasmine.any(Array));
    expect(scope.criteria).toBe('ipid');
  });
});
