'use strict';

describe('the tppController', function () {
    var scope, controller, resources;
    beforeEach(module('tpp.controllers'));


    beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
        resources = [{"id":1,"name":"Robin"},{"id":2,"name":"Marco"}];
        $httpBackend.whenGET('/resource').respond(resources);
        $httpBackend.whenPOST('/resource').respond(function(method, url, data) {
            resources.push(angular.fromJson(data));
        });

        scope = $rootScope.$new();
        controller = $controller('tppCtrl', {$scope: scope});
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
           expect(scope.resourceList).toContain({name: "Johannes"});
           expect(resources).toContain({name: "Johannes"});
           expect(newResource.name).toBe('');
       });
    });

});