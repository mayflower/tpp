angular.module('schnellerApp').directive('exceededlimit', function() {
    return {
        restricted: 'E',
        template: '<div ng-transclude class="label"></div>',
        transclude: true,
        replace: true
    };
});