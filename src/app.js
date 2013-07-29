angular.module('tppApp', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {controller: "tppController", templateUrl: "src/views/list.html"})
      .otherwise({redirectTo: '/'});
  }]);