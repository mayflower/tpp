angular.module('schnellerApp')
    .directive('exceeded', function() {
        return {
          restrict: 'E',
          template: '<div ng-transclude class="label" ng-class="{\'label-warning\': high < val}"></div>',
          transclude: true,
          replace: true,
          scope: {
            // bind "high" in template to "high" in directive
            high: '@',
            val: '@'
          }
        };
    }
);
