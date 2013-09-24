/**
 * Created by robin on 9/24/13.
 */

angular.module(
    'tpp.controllers.master', []
).controller('masterCtrl', ['$scope', function ($scope) {
    $scope.keyPressed = function ($event) {
        $scope.$broadcast('keyPressed', $event);
    }
}]);
