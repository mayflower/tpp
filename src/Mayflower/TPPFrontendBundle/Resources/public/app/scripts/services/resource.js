'use strict';

angular.module(
    'tpp.resource', ['ngResource']
).factory('Resource', function ($resource) {
    return $resource(
        '/api/resource/:resourceId',
        {
            resourceId:'@id'
        }
    );
});
