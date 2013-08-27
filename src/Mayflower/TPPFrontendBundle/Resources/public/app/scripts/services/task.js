'use strict';

angular.module(
    'tpp.task', ['ngResource']
).factory('Task', function ($resource) {
    return $resource(
        '/api/task/:taskId',
        {
            taskId: '@id'
        }
    );
});
