angular.module('schnellerApp', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {controller: "listCtrl", templateUrl: "views/list.html"})
      .otherwise({redirectTo: '/'});
  }]);