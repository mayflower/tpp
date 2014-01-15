'use strict';

describe('the tppDisplayCtrl', function () {
    var scope, controller, location, routeParams = {}, ResourceRes, ProjectRes;
    beforeEach(module('tpp.controllers'));

    beforeEach(inject(function ($rootScope, $controller, $location, Resource, Project) {

        scope = $rootScope.$new();
        location = $location;
        ResourceRes = Resource;
        ProjectRes = Project;

        var windowMock = { confirm: function(msg) { return true } }
        controller = $controller(
            'tppDisplayCtrl',
            {
                $scope: scope,
                $window: windowMock,
                $routeParams: routeParams,
                Project: Project
            }
        );
    }));

    describe('default routeParams', function () {
        var thisWeek = moment().startOf('week');

        it('should show 7 weeks', function () {
            expect(scope.weeks.numWeeks).toEqual(7);
        });

        it('should default to this year', function () {
            expect(scope.weeks.date.weekYear()).toEqual(thisWeek.weekYear());
        });

        it('should default to this week', function () {
            expect(scope.weeks.date.week()).toEqual(thisWeek.week());
            expect(scope.isCurrent(scope.weeks.date)).toBeTruthy();
        });

        it('should set location search params', function () {
            expect(location.search().week).toEqual(thisWeek.week());
            expect(location.search().year).toEqual(thisWeek.weekYear());
            expect(location.search().numWeeks).toEqual(7);
        });
    });

    describe('modified routeParams', function () {
        describe('modified numWeeks', function () {
            beforeEach(inject(function ($rootScope, $controller) {
                routeParams = {
                    'numWeeks': 5
                };

                scope = $rootScope.$new();

                controller = $controller(
                    'tppDisplayCtrl',
                    {
                        $scope: scope,
                        $routeParams: routeParams
                    }
                );
            }));

            it('should show 5 weeks', function () {
                expect(scope.weeks.numWeeks).toEqual(5);
            });
        });

        describe('modify date', function () {
            beforeEach(inject(function ($rootScope, $controller) {
                routeParams = {
                    'week': 35,
                    'year': 2013
                };

                scope = $rootScope.$new();

                controller = $controller(
                    'tppDisplayCtrl',
                    {
                        $scope: scope,
                        $routeParams: routeParams
                    }
                );
            }));

            it('should show 5 weeks', function () {
                expect(scope.weeks.date.week()).toEqual(35);
                expect(scope.weeks.date.weekYear()).toEqual(2013);
            });

            it('should be able to go to previous week', function () {
                scope.back();
                expect(scope.weeks.date.week()).toEqual(34);
            });

            it('should be able to go to next week', function () {
                scope.forward();
                expect(scope.weeks.date.week()).toEqual(36);
            });
        });
    });

    describe('sortListBy', function () {

        it('should have criteria properties', function () {
            expect(scope.sortCriteria).toBe('name');
        });

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

    describe('modify resource', function () {
        it('should add resource to resourceList', function () {
            var newResource = new ResourceRes({name: "Johannes"});
            scope.addResource(newResource);
            expect(scope.resourceList).toContain(new ResourceRes({name: "Johannes"}));
            expect(newResource.name).toBe('');
        });

        it('should remove resource from resourceList', function () {
            var resource = new ResourceRes({name: "Johannes"});
            scope.removeResource(resource);
            expect(scope.resourceList).toEqual([]);
        });
    });

});
