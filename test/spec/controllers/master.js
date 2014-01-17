'use strict';

describe('masterCtrl', function () {
    var scope, controller;
    beforeEach(module('tpp.controllers.master'));

    beforeEach(inject(function ($rootScope, $controller) {

        scope = $rootScope.$new();

        controller = $controller(
            'masterCtrl',
            {
                $scope: scope
            }
        );
    }));

    describe('key event delegation', function () {
        it('should broadcast keyPressed event', function () {
            var broadcastSpy = spyOn(scope, '$broadcast'),
                event = {'id': 'pseudoEvent'};

            scope.keyPressed(event);

            expect(broadcastSpy).toHaveBeenCalledWith('keyPressed', event);
        });
    });
});
