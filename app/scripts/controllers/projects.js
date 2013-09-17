'use strict';

angular.module(
    'tpp.controllers.projects', ['tpp.project']
).controller(
    'projectsCtrl', ['$scope', 'Project',
function ($scope, Project) {
    $scope.projectList = Project.query();
}]);
