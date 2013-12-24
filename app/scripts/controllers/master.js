'use strict';

angular.module(
    'tpp.controllers.master', []
).controller('masterCtrl', ['$scope', function ($scope) {
    $scope.keyPressed = function ($event) {
        $scope.$broadcast('keyPressed', $event);
    };
}]);
