'use strict';

angular.module(
    'tpp.project', ['ngResource']
).factory('Project', function ($resource) {
    var arrayInterceptor = {
        response: function (response) {
            angular.forEach(response.resource, function (task) {
                task.begin = moment(task.begin.date);
                task.end = moment(task.end.date);
            });
        }
    };
    var singleInterceptor = {
        response: function (response) {
            var task = response.resource;
            task.begin = moment(task.begin.date);
            task.end = moment(task.end.date);
        }
    };


    return $resource(
        '/api/project/:projectId',
        {
            projectId: '@id'
        },
        {
            'update': {
                method: 'PUT',
                interceptor: singleInterceptor
            },
            'save': {
                method: 'POST',
                interceptor: singleInterceptor
            },
            'get': {
                method: 'GET',
                interceptor: singleInterceptor
            },
            'query': {
                method: 'GET',
                interceptor: arrayInterceptor,
                isArray: true
            }
        }
    );
});
