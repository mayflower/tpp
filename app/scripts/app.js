'use strict';

angular.module(
    'tpp', ['tpp.controllers', 'tpp.controllers.master', 'tpp.controllers.projects', 'ngRoute', 'activeLink']
).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
        templateUrl: '/views/list.html',
        controller: 'tppDisplayCtrl',
        reloadOnSearch: false
    });
    $routeProvider.when('/projects', {
        templateUrl: '/views/project.html',
        controller: 'projectsCtrl'
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);
