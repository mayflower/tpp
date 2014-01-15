'use strict';

angular.module(
    'tpp.controllers.tasks', ['ui.bootstrap', 'tpp.task']
).controller('taskEditModalCtrl',
    ['$scope', '$modalInstance', 'Task', 'task', 'projectList',
    function ($scope, $modalInstance, Task, task, projectList)
{
    $scope.projectList = projectList;

    // sets the correct title in template
    $scope.isEdit = true;

    // we want a copy here so that the task doesn't change while the modal is open,
    // TODO: investigate why angular.copy does not work here (task disappears but gets updated on backend)
    $scope.task = new Task();
    $scope.task.resourceId = task.resourceId;
    $scope.task.week = task.week;
    $scope.task.id = task.id;
    $scope.task.project = task.project;

    $scope.ok = function () {
        $modalInstance.close($scope.task);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]).controller('taskAddModalCtrl',
    ['$scope', '$modalInstance', 'Task', 'resourceId', 'week', 'projectList',
    function ($scope, $modalInstance, Task, resourceId, week, projectList)
{
    $scope.projectList = projectList;

    $scope.task = new Task();
    $scope.task.resourceId = resourceId;
    $scope.task.week = week;

    $scope.ok = function () {
        $modalInstance.close($scope.task);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
