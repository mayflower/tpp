var tppAppTest = angular.module('tppTest', ['tpp', 'ngMockE2E']);

tppAppTest.run(function ($httpBackend) {
    console.log('Setting up mocks');
    $httpBackend.whenGET('/resource').respond([{"id":1,"name":"Robin"},{"id":2,"name":"Marco"},{"id":3,"name":"Johannes"}]);
    $httpBackend.whenPOST('/resource').respond(function (method, url, data) {
        resources.push(angular.fromJson(data));
    });
    $httpBackend.whenGET(/\/views\//).passThrough();
});
