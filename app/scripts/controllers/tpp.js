'use strict';

angular.module(
        'tpp.controllers', ['tpp.task', 'tpp.resource', 'tpp.utils']
).controller(
        'tppDisplayCtrl', ['$scope', '$routeParams', '$location', 'Resource', 'Task', 'dateUtil',
function ($scope, $routeParams, $location, Resource, Task, dateUtil) {

    $scope.OVERVIEW_THRESHOLD = 10;

    $scope.weeks = {
        date: (function () {
            var date = moment();
            if ($routeParams.year) {
                date.weekYear($routeParams.year);
            }
            if ($routeParams.week) {
                date.week($routeParams.week);
            }
            return date.startOf('week');
        })(),
        numWeeks: parseInt($routeParams.numWeeks) || 7
    };

    $scope.taskList = [];

    ($scope.setUp = function (weeks) {
        // build List of weeks from user inputted date and numWeeks
        $scope.weekList = dateUtil.getWeekList(weeks);

        // fetch tasks from server (only set list when finished loading to avoid flashing)
        var taskList = Task.query({
            numWeeks: weeks.numWeeks,
            week: weeks.date.week(),
            year: weeks.date.weekYear()
        }, function () {
            $scope.taskList = taskList;
        });

        $location.search({
            'year': $scope.weeks.date.weekYear(),
            'week': $scope.weeks.date.week(),
            'numWeeks': $scope.weeks.numWeeks || 7
        });

    })($scope.weeks);

    // fetch resources from server
    $scope.resourceList = Resource.query();

    // re-fetch on changing weeks
    $scope.$watchCollection('weeks', function (newWeeks) {
        $scope.setUp(newWeeks);
    });

    // find Tasks from taskList by resource and week
    $scope.getTasks = function (resource, week) {
          return $scope.taskList.filter(function (task) {
              return task.week.isSame(week) && task.resourceId === resource.id;
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
        resource.$delete();
        $scope.resourceList = $scope.resourceList.filter(function (r) {
            return r.id !== resource.id;
        });
    };

    // notify dialog
    $scope.addTask = function (resourceId, week) {
        $scope.$broadcast('addTask', resourceId, week);
    };

    // notify dialog
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

    $scope.$on('taskEdited', function (event, task) {
        $scope.taskList = $scope.taskList.filter(function (t) {
            return t.id !== task.id;
        });
        $scope.taskList.push(task);
    });

    // default setting on what the list should be sorted
    $scope.sortCriteria = 'name';

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
        return moment().startOf('week').isSame(week);
    };

    // go one week back
    $scope.back = function () {
        $scope.weeks.date.subtract(1, 'w');
        $scope.setUp($scope.weeks);
    };

    // go one week forward
    $scope.forward = function () {
        $scope.weeks.date.add(1, 'w');
        $scope.setUp($scope.weeks);
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
        $scope.resetTask();
        $scope.isEdit = false;
        $scope.task.resourceId = resourceId;
        $scope.task.week = week;
        $('#task-modal').modal({
            'show': true
        });
    });

    $scope.$on('editTask', function (event, task) {
        $scope.resetTask();
        $scope.isEdit = true;
        $scope.task = angular.copy(task);
        $('#task-modal').modal({
            'show': true
        });
    });

    $scope.submit = function () {
        if ($scope.isEdit) {
            $scope.task.$update();
            $scope.$emit('taskEdited', $scope.task);
        } else {
            $scope.task.$save();
            $scope.$emit('taskAdded', $scope.task);
        }
    };

}]);
