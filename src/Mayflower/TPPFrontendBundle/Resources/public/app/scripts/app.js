'use strict';

angular.module(
        'tpp', ['tpp.controllers']
).config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
//    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
        templateUrl: '/bundles/mayflowertppfrontend/app/views/list.html',
        controller: 'tppDisplayCtrl'
    });
    $routeProvider.otherwise({redirectTo: '/'});
}]);
