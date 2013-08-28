'use strict';

angular.module(
        'tpp.controllers', ['tpp.task', 'tpp.resource', 'tpp.utils']
).controller('tppDisplayCtrl', ['$scope', 'Resource', 'Task', 'weekList', function ($scope, Resource, Task, weekList) {

    // define the list of members
    $scope.resourceList = Resource.query();
    $scope.taskList = Task.query({
        week: 35,
        numWeeks: 7
    });

    $scope.getTasks = function (resourceId, week) {
        var tasks = [];
        for (var i = 0; i < $scope.taskList.length; i++) {
            var taskWeek = moment($scope.taskList[i].week.date);
            var timeDiff = taskWeek.diff(week.date);

            // timeDiff < week
            if ($scope.taskList[i].resourceId === resourceId && timeDiff >= 0 && timeDiff < 1000 * 60 * 60 * 24 * 7) {
                tasks.push($scope.taskList[i]);
            }
        }
        return tasks;
    };

    $scope.addResource = function (addedResource) {
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
            var resources = Resource.query(function () {
                $scope.resourceList = resources;
            });

        }
    };

    $scope.addTask = function (resourceId, week) {
        $scope.$broadcast('addTask', resourceId, week);
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

    $scope.isCurrent = function (week) {
        return moment().startOf('week').isSame(week.date);
    };

}]).controller('taskCtrl', ['$scope', 'Task', function ($scope, Task) {

    $scope.task = new Task({
        title: '',
        color: 'yellow'
    });

    $scope.isEdit = false;

    $scope.$on('addTask', function (event, resourceId, week) {
        $scope.isEdit = false;
        $('#task-modal').modal({
            'show': true
        });

    });

    $scope.submit = function () {
        $scope.task.$save();
        $scope.$emit('taskAdded', newTask);
        // reset text input
        $scope.task.title = '';
        $scope.task.color = 'yellow';
    }

    $scope.setEditTaskOpts = function (task, resourceId, week) {
        $scope.editTaskOpts = {
            resourceId: resourceId,
            week: week.date
        };

        $scope.editTask = task;
    };
    $scope.editTask = function () {
        var task = new Task({
            title: addedTask.title,
            resourceId: $scope.newTaskOpts.resourceId,
            week: $scope.newTaskOpts.week,
            color: addedTask.color
        });
        task.$save();
        $scope.taskList.push(task);
        // reset text input
        addedTask.title = '';

        addedTask.color = 'yellow';
    };

}]);
