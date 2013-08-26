'use strict';

angular.module(
    'tpp.controllers', ['tpp.services', 'tpp.utils']
).controller('tppCtrl', ['$scope', 'Resource', 'weekList', function ($scope, Resource, weekList) {

    // define the list of members
    $scope.resourceList = Resource.query();

    $scope.addResource = function (addedResource) {
        var resource = new Resource({
            name: addedResource.name
        });
        resource.$save();

        $scope.resourceList.push(resource);

        // reset text input
        addedResource.name = '';
    };

    $scope.addTask = function (addedTask) {
        var task = new Task({
            title: addedTask.title
        });
        resource.$save();

        $scope.resourceList.push(resource);

        // reset text input
        addedResource.name = '';
    };

    // default setting on what the list should be sorted
    $scope.sortCriteria = 'name';

    // calculate weeklist from the first member
    $scope.weekList = weekList;

    /**
     * Sort list by the passed criteria.
     * When the criteria was used before pretend a - before the criteria name to reverse sorting.
     * The name of the sort criteria is simply the key inside a data object passed by the dataprovider.
     *
     * @param {string} sortCriteria
     */
    $scope.sortListBy = function(sortCriteria) {
        if ($scope.sortCriteria === sortCriteria) {
            $scope.sortCriteria = '-' + sortCriteria;
        } else {
            $scope.sortCriteria = sortCriteria;
        }
    };

}]);