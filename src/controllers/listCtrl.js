angular.module('schnellerApp')
  .controller('listCtrl', ['$scope', 'dataProvider', function($scope, dataProvider) {
    $scope.list = dataProvider
    $scope.criteria = 'ipid'
    $scope.sort = function(criteria) {
        if ($scope.criteria === criteria) {
            $scope.criteria = '-' + criteria;
        } else {
            $scope.criteria = criteria;
        }
    }
  }]);
