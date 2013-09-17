angular.module(
    'activeLink', []
).directive('activeLink', ['$location', function (location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var linkClass = attrs.activeLink;
            var path = angular.element(element.children()[0]).attr('href');
            scope.location = location;
            scope.$watch('location.path()', function (newPath) {
                if (path === newPath) {
                    element.addClass(linkClass);
                } else {
                    element.removeClass(linkClass);
                }
            });
        }

    };

}]);
