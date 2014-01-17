'use strict';

angular.module(
    'tpp.controllers', ['ui.bootstrap', 'tpp.task', 'tpp.resource', 'tpp.project', 'tpp.utils', 'tpp.controllers.tasks']
).controller(
    'tppDisplayCtrl', ['$window', '$scope', '$routeParams', '$location', '$modal', 'Resource', 'Task', 'Project', 'dateUtil',
    function ($window, $scope, $routeParams, $location, $modal, Resource, Task, Project, dateUtil)
{
    $scope.OVERVIEW_THRESHOLD = 10;
    $scope.tasks = {};
    var taskList = [];

    /**
     * This function builds an object of tasks which are organized by resource ids and weeks:
     * {
     *   resourceId1: {
     *     week1: [task1, task2]
     *   }
     * }
     *
     * This allows the loop in template views/list.html to access the correct task fast
     *
     * @param taskList Array of tasks
     * @returns Object
     */
    function buildTasks(taskList) {
        return taskList.reduce(function (filtered, task) {
            filtered[task.resourceId] = filtered[task.resourceId] || {};
            filtered[task.resourceId][task.week] = (filtered[task.resourceId][task.week] || []).concat(task);

            return filtered;
        }, {});
    }

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
        numWeeks: parseInt($routeParams.numWeeks) || parseInt(localStorage.getItem('tppDisplayCtrl.numWeeks')) || 7
    };


    ($scope.setUp = function (weeks) {
        // build List of weeks from user inputted date and numWeeks
        $scope.weekList = dateUtil.getWeekList(weeks);

        // fetch tasks from server (only set list when finished loading to avoid flashing)
        taskList = Task.query({
            numWeeks: weeks.numWeeks,
            week: weeks.date.week(),
            year: weeks.date.weekYear()
        }, function () {
            $scope.tasks = buildTasks(taskList);
        });

        localStorage.setItem('tppDisplayCtrl.numWeeks', $scope.weeks.numWeeks);

        $location.search({
            'year': $scope.weeks.date.weekYear(),
            'week': $scope.weeks.date.week(),
            'numWeeks': $scope.weeks.numWeeks || 7
        });

    })($scope.weeks);

    // fetch resources from server
    $scope.resourceList = Resource.query();

    // fetch projects from server
    $scope.projectList = Project.query();

    // re-fetch on changing weeks
    $scope.$watchCollection('weeks', function (newWeeks) {
        $scope.setUp(newWeeks);
    });

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
        if ($window.confirm('Really delete?')) {
            resource.$delete();
            $scope.resourceList = $scope.resourceList.filter(function (r) {
                return r.id !== resource.id;
            });
        }
    };

    $scope.addTask = function (resourceId, week) {
        var modalInstance = $modal.open({
            templateUrl: '/views/taskModal.html',
            controller: 'taskAddModalCtrl',
            resolve: {
                'resourceId': function () {
                    return resourceId;
                },
                'week': function () {
                    return week;
                },
                'projectList': function () {
                    return $scope.projectList;
                }
            }
        });

        modalInstance.result.then(function (task) {
            task.$save();
            taskList.push(task);
            $scope.tasks = buildTasks(taskList);
        });
    };

    $scope.editTask = function (task) {
        // fix selected option in dialog
        for (var i = 0; i < $scope.projectList.length; i++) {
            if (task.project.id === $scope.projectList[i].id) {
                task.project = $scope.projectList[i];
                break;
            }
        }
        var modalInstance = $modal.open({
            templateUrl: '/views/taskModal.html',
            controller: 'taskEditModalCtrl',
            resolve: {
                'task': function () {
                    return task;
                },
                'projectList': function () {
                    return $scope.projectList;
                }
            }
        });

        modalInstance.result.then(function (task) {
            task.$update();
            taskList = taskList.filter(function (t) {
                return t.id !== task.id;
            });
            taskList.push(task);
            $scope.tasks = buildTasks(taskList);
        });
    };

    $scope.deleteTask = function (task) {
        task.$delete();
        taskList = taskList.filter(function (t) {
            return t.id !== task.id;
        });
        $scope.tasks = buildTasks(taskList);
    };

    $scope.$on('keyPressed', function (event, keyPressedEvent) {
        var LEFT_ARROW = 37,
            UP_ARROW = 38,
            RIGHT_ARROW = 39,
            DOWN_ARROW = 40;
        if (LEFT_ARROW === keyPressedEvent.keyCode) {
            $scope.back();
        } else if (RIGHT_ARROW === keyPressedEvent.keyCode) {
            $scope.forward();
        } else if (UP_ARROW === keyPressedEvent.keyCode) {
            $scope.weeks.numWeeks += 1;
            keyPressedEvent.preventDefault();
        } else if (DOWN_ARROW === keyPressedEvent.keyCode) {
            $scope.weeks.numWeeks -= 1;
            keyPressedEvent.preventDefault();
        }
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

}]);
