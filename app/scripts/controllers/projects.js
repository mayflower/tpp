'use strict';

angular.module(
    'tpp.controllers.projects', ['ui.bootstrap', 'tpp.project', 'colorpicker.module']
).controller(
    'projectsCtrl', ['$scope', '$modal', 'Project',
    function ($scope, $modal, Project)
{
    $scope.projectList = Project.query();

    // notify dialog
    $scope.addProject = function () {
        var modalInstance = $modal.open({
            templateUrl: '/views/projectModal.html',
            controller: 'projectModalCtrl',
            resolve: {
                'project': function () {
                    return null;
                }
            }
        });

        modalInstance.result.then(function (project) {
            project.$save();
            $scope.projectList.push(project);
        });
    };

    // notify dialog
    $scope.editProject = function (project) {
        var modalInstance = $modal.open({
            templateUrl: '/views/projectModal.html',
            controller: 'projectModalCtrl',
            resolve: {
                'project': function () {
                    return project;
                }
            }
        });

        modalInstance.result.then(function (project) {
            project.$update();
            $scope.projectList = $scope.projectList.filter(function (p) {
                return p.id !== project.id;
            });
            $scope.projectList.push(project);
        });
    };

    $scope.deleteProject = function (project) {
        project.$delete();
        $scope.projectList = $scope.projectList.filter(function (t) {
            return t.id !== project.id;
        });
    };


    // default setting on what the list should be sorted
    $scope.sortCriteria = 'name';

    /**
     * Sort list by the passed criteria.
     * When the criteria was used before pretend a - before the criteria name to reverse sorting.
     * The name of the sort criteria is simply the key inside a data object passed by the data provider.
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

}]).controller('projectModalCtrl',
    ['$scope', '$modalInstance', 'Project', 'project',
    function ($scope, $modalInstance, Project, project)
{
    $scope.DATE_FORMAT = 'dd.MM.yyyy';
    $scope.dateOptions = {
        'starting-day': 1,
        'show-button-bar': false
    };

    // sets the correct title in template
    $scope.isEdit = !!project;

    if ($scope.isEdit) {
        $scope.project = angular.copy(project);
    } else {
        $scope.project = new Project({
            name: '',
            color: '#CCC',
            begin: moment(),
            end: moment()
        });
    }
    // these are references => no special handling needed
    $scope.project.beginJSDate = $scope.project.begin.utc().toDate();
    $scope.project.endJSDate = $scope.project.end.utc().toDate();

    $scope.ok = function () {
        $scope.project.begin = moment($scope.project.beginJSDate);
        $scope.project.end = moment($scope.project.endJSDate);
        $modalInstance.close($scope.project);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
