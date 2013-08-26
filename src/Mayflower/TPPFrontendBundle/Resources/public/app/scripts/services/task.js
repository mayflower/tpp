'use strict';

angular.module(
    'tpp.services', ['ngResource']
).factory('Resource', function ($resource) {
    return $resource('/resource/:resourceId/task/:taskId', {taskId:'@id'});
});
