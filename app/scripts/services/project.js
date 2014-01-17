'use strict';

angular.module(
    'tpp.project', ['ngResource']
).factory('Project', function ($resource) {
    var arrayInterceptor = {
        response: function (response) {
            response.resource = response.resource.map(function (project) {
                project.begin = moment(project.begin.date);
                project.end = moment(project.end.date);

                return project;
            });
        }
    };
    var singleInterceptor = {
        response: function (response) {
            var project = response.resource;
            project.begin = moment(project.begin.date);
            project.end = moment(project.end.date);
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
