'use strict';

describe('the tppController', function () {
    var scope, controller, resources, tasks;
    beforeEach(module('tpp.controllers'));


    beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
        resources = [];
        $httpBackend.whenGET('/api/resource').respond(resources);
        $httpBackend.whenPOST('/api/resource').respond(function(method, url, data) {
            resources.push(angular.fromJson(data));
        });

        tasks = [];
        $httpBackend.whenGET(/\/api\/task.+/).respond(tasks);
        $httpBackend.whenPOST('/api/task').respond(function(method, url, data) {
            tasks.push(angular.fromJson(data));
        });

        scope = $rootScope.$new();
        controller = $controller('tppCtrl', {$scope: scope});

//        this.addMatchers({
//
//        })
    }));

    it('should have list and criteria properties', function () {
        expect(scope.resourceList).toEqual(jasmine.any(Array));
        expect(scope.sortCriteria).toBe('name');
    });

    describe('sortListBy', function () {

        it('should set sort criteria', function () {
            scope.sortListBy('foo');
            expect(scope.sortCriteria).toBe('foo');
        });

        it('should prefix sort criteria with "-" when called twice with same param', function () {
            scope.sortListBy('foo');
            expect(scope.sortCriteria).toBe('foo');

            scope.sortListBy('foo');
            expect(scope.sortCriteria).toBe('-foo');

            scope.sortListBy('foo');
            expect(scope.sortCriteria).toBe('foo');
        });

    });

    describe('addResource', function () {
       it('should add resource to resourceList and resources', function () {
           var newResource = {name: "Johannes"};
           scope.addResource(newResource);
           expect(scope.resourceList[0].name).toBe("Johannes");
           expect(resources).toContain({name: "Johannes"});
           expect(newResource.name).toBe('');
       });
    });

});