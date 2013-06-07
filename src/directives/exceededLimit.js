angular.module('schnellerApp')
    .directive('exceeded', function() {
        return {
            restrict: 'E',
            template: '<div ng-transclude class="label"></div>',
            transclude: true,
            replace: true,
            scope: {},
        };
    }
);
