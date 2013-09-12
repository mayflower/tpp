'use strict';

angular.module(
        'tpp.controllers', ['tpp.task', 'tpp.resource', 'tpp.utils']
).controller('tppDisplayCtrl', ['$scope', 'Resource', 'Task', 'weekList', function ($scope, Resource, Task, weekList) {

    // fetch tasks from server
    $scope.taskList = Task.query({
        week: 35,
        numWeeks: 7
    });

    // fetch resources from server
    $scope.resourceList = Resource.query();

    // find Tasks from taskList by resource and week
    $scope.getTasks = function (resource, week) {
          return $scope.taskList.filter(function (task) {
              return task.week.diff(week.date) === 0 && task.resourceId === resource.id;
          });
    };

    $scope.addResource = function (addedResource) {

        // Don't use copy here, ID will not be set otherwise
        var resource = new Resource({
            name: addedResource.name
        });
        resource.$save();

        $scope.resourceList.push(resource);

        // reset text input
        addedResource.name = '';
    };

    $scope.removeResource = function (resource) {
        if (confirm("Wirklich löschen?")) {
            resource.$delete();
            $scope.resourceList = $scope.resourceList.filter(function (r) {
                return r.id !== resource.id;
            });
        }
    };

    $scope.addTask = function (resourceId, week) {
        $scope.$broadcast('addTask', resourceId, week);
    };

    $scope.editTask = function (task) {
        $scope.$broadcast('editTask', task);
    };

    $scope.deleteTask = function (task) {
        task.$delete();
        $scope.taskList = $scope.taskList.filter(function (t) {
            return t.id !== task.id;
        })
    };

    $scope.$on('taskAdded', function (event, task) {
        $scope.taskList.push(task);
    });

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

    $scope.isCurrent = function (week) {
        return moment().startOf('week').isSame(week.date);
    };

}]).controller('taskCtrl', ['$scope', 'Task', function ($scope, Task) {

    $scope.isEdit = false;

    ($scope.resetTask = function () {
        $scope.task = new Task({
            title: '',
            color: 'yellow'
        });
    })();

    $scope.$on('addTask', function (event, resourceId, week) {
        $scope.isEdit = false;
        $scope.task.resourceId = resourceId;
        $scope.task.week = week.date;
        $('#task-modal').modal({
            'show': true
        });
    });

    $scope.$on('editTask', function (event, task) {
        $scope.isEdit = true;
        $scope.task = task;
        $scope.backup = angular.copy(task);
        $('#task-modal').modal({
            'show': true
        });
    });

    $scope.submit = function () {
        if ($scope.isEdit) {
            $scope.task.$update();
        } else {
            $scope.task.$save();
            $scope.$emit('taskAdded', $scope.task);
        }
        $scope.resetTask();
    };

    $scope.cancel = function () {
        $scope.resetTask();
    };

}]);
