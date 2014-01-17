'use strict';

angular.module(
    'tpp.task', ['ngResource']
).factory('Task', function ($resource) {

    var arrayInterceptor = {
        response: function (response) {
            response.resource = response.resource.map(function (task) {
                task.week = moment(task.week.date);

                return task;
            });
        }
    };

    var singleInterceptor = {
        response: function (response) {
            var task = response.resource;
            task.week = moment(task.week.date);
        }
    };

    return $resource(
        '/api/task/:taskId',
        {
            taskId: '@id'
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

