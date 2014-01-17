'use strict';

describe('tppDisplayCtrl', function () {
    var scope, controller, location, routeParams = {}, modal, ResourceRes, ProjectRes, TaskRes;
    beforeEach(module('tpp.controllers'));

    beforeEach(inject(function ($rootScope, $controller, $location, $modal, Resource, Project, Task) {

        scope = $rootScope.$new();
        location = $location;
        ResourceRes = Resource;
        ProjectRes = Project;
        TaskRes = Task;
        modal = $modal;

        var windowMock = { confirm: function(msg) { return true; } };

        controller = $controller(
            'tppDisplayCtrl',
            {
                $scope: scope,
                $window: windowMock,
                $routeParams: routeParams,
                $modal: $modal,
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
            var newResource = new ResourceRes({name: 'Johannes'});
            scope.addResource(newResource);
            expect(scope.resourceList).toContain(new ResourceRes({name: 'Johannes'}));
            expect(newResource.name).toBe('');
        });

        it('should remove resource from resourceList', function () {
            var resource = new ResourceRes({name: 'Johannes'});
            scope.removeResource(resource);
            expect(scope.resourceList).toEqual([]);
        });
    });

    describe('tasks', function () {
        it('should get the correct tasks for given resource and week', function () {
            var weekCorrect = moment(),
                weekWrong = moment().add(5, 'w'),
                resourceCorrect = new ResourceRes({'id': 1}),
                resourceWrong = new ResourceRes({'id': 2}),
                taskCorrect1 = new TaskRes({'week': weekCorrect, 'resourceId': resourceCorrect.id, 'title': 'correct1'}),
                taskCorrect2 = new TaskRes({'week': weekCorrect, 'resourceId': resourceCorrect.id, 'title': 'correct2'});
            scope.taskList = [
                taskCorrect1,
                taskCorrect2,
                new TaskRes({'week': weekCorrect, 'resourceId': resourceWrong.id, 'title': 'wrong1'}),
                new TaskRes({'week': weekWrong, 'resourceId': resourceCorrect.id, 'title': 'wrong2'}),
                new TaskRes({'week': weekWrong, 'resourceId': resourceWrong.id, 'title': 'wrong3'}),
            ];

            expect(scope.getTasks(resourceCorrect, weekCorrect)).toEqual([
                taskCorrect1,
                taskCorrect2,
            ]);
        });

        it('should open the modal when adding tasks', function () {
            var modalOpenSpy = spyOn(modal, 'open').andCallThrough(), week = moment();

            scope.addTask(1, week);

            expect(modalOpenSpy).toHaveBeenCalled();
        });

        it('should open the modal when editing tasks', function () {
            var modalOpenSpy = spyOn(modal, 'open').andCallThrough();

            scope.editTask(new TaskRes());

            expect(modalOpenSpy).toHaveBeenCalled();
        });

        it('should delete tasks on server and client', function () {
            var taskToDelete = new TaskRes({'id': 1}),
                taskNotToDelete = new TaskRes({'id': 2}),
                taskDeleteSpy = spyOn(taskToDelete, '$delete');

            scope.taskList = [taskToDelete, taskNotToDelete];
            scope.deleteTask(taskToDelete);

            expect(taskDeleteSpy).toHaveBeenCalled();
            expect(scope.taskList).toNotContain(taskToDelete);
            expect(scope.taskList).toContain(taskNotToDelete);
        });
    });
});
