angular.module('schnellerApp')
  .controller('listCtrl', ['$scope', 'dataProvider', function($scope, dataProvider) {
    $scope.list = dataProvider
  }]);
