'use strict';

angular.module(
        'tpp', ['tpp.controllers', 'ngRoute']
).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
        templateUrl: '/views/list.html',
        controller: 'tppDisplayCtrl',
        reloadOnSearch: false
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);
