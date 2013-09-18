'use strict';

angular.module(
    'tpp.controllers.projects', ['tpp.project', 'datepicker']
).controller(
    'projectsCtrl', ['$scope', 'Project',
function ($scope, Project) {

    $scope.projectList = Project.query();

    // notify dialog
    $scope.addProject = function () {
        $scope.$broadcast('addProject');
    };

    // notify dialog
    $scope.editProject = function (project) {
        $scope.$broadcast('editProject', project);
    };

    $scope.deleteProject = function (project) {
        project.$delete();
        $scope.projectList = $scope.projectList.filter(function (t) {
            return t.id !== project.id;
        })
    };

    $scope.$on('projectAdded', function (event, project) {
        $scope.projectList.push(project);
    });

    $scope.$on('projectEdited', function (event, project) {
        $scope.projectList = $scope.projectList.filter(function (p) {
            return p.id !== project.id;
        });
        $scope.projectList.push(project);
    });

}]).controller('projectCtrl', ['$scope', 'Project', function ($scope, Project) {

    $scope.DATE_FORMAT = 'DD.MM.YYYY';

    $scope.isEdit = false;

    ($scope.resetProject = function () {
        $scope.project = new Project({
            name: '',
            color: '#CCC',
            beginDisplay: moment().format($scope.DATE_FORMAT),
            endDisplay: moment().format($scope.DATE_FORMAT)
        });
    })();

    $scope.$on('addProject', function () {
        $scope.resetProject();
        $scope.isEdit = false;
        $('#project-modal').modal({
            'show': true
        });
    });

    $scope.$on('editProject', function (event, project) {
        $scope.resetProject();
        $scope.isEdit = true;
        $scope.project = angular.copy(project);
        $scope.project.beginDisplay = $scope.project.begin.format($scope.DATE_FORMAT);
        $scope.project.endDisplay = $scope.project.end.format($scope.DATE_FORMAT);
        $('#project-modal').modal({
            'show': true
        });
    });

    $scope.submit = function () {
        $scope.project.begin = moment.utc($scope.project.beginDisplay, $scope.DATE_FORMAT);
        $scope.project.end = moment.utc($scope.project.endDisplay, $scope.DATE_FORMAT);

        console.log($scope.project.begin);
        if ($scope.isEdit) {
            $scope.project.$update();
            $scope.$emit('projectEdited', $scope.project);
        } else {
            $scope.project.$save();
            $scope.$emit('projectAdded', $scope.project);
        }
    };

}]);
