angular.module('tppApp')
  .controller('tppController', ['$scope', 'dataProvider', function ($scope, dataProvider) {

    // define the list of members
    $scope.memberList = dataProvider.memberList;

    // default setting on what the list should be sorted
    $scope.sortCriteria = 'name';

    /**
     * Sort list by the passed criteria.
     * When the criteria was used before pretend a - before the criteria name to reverse sorting.
     * The name of the sort criteria is simply the key inside a data object passed by the dataprovider.
     *
     * @param sortCriteria
     */
    $scope.sortListBy = function (sortCriteria) {
      if ($scope.sortCriteria === sortCriteria) {
        $scope.sortCriteria = '-' + sortCriteria;
      } else {
        $scope.sortCriteria = sortCriteria;
      }
    }

  }]);
