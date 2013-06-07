angular.module('schnellerApp', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {controller: "listCtrl", templateUrl: "src/views/list.html"})
      .otherwise({redirectTo: '/'});
  }]);