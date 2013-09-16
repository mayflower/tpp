var tppAppTest = angular.module('tppTest', ['tpp', 'ngMockE2E']);
var nextTaskId = 21;
var tasks = [
    {"id": 1, "title": "Test123", "resourceId": 1, "week": {"date": "2013-08-27 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "yellow"},
    {"id": 5, "title": "Blub", "resourceId": 1, "week": {"date": "2013-09-09 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "yellow"},
    {"id": 6, "title": "test2344556", "resourceId": 3, "week": {"date": "2013-09-02 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "yellow"},
    {"id": 8, "title": "yipdi", "resourceId": 2, "week": {"date": "2013-08-26 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "yellow"},
    {"id": 9, "title": "12345", "resourceId": 3, "week": {"date": "2013-09-02 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "yellow"},
    {"id": 11, "title": "test", "resourceId": 1, "week": {"date": "2013-09-16 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "yellow"},
    {"id": 12, "title": "blub", "resourceId": 2, "week": {"date": "2013-09-23 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "yellow"},
    {"id": 15, "title": "test", "resourceId": 1, "week": {"date": "2013-09-02 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "yellow"},
    {"id": 16, "title": "testgr\u00fcn", "resourceId": 2, "week": {"date": "2013-09-02 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "green"},
    {"id": 17, "title": "testlila", "resourceId": 2, "week": {"date": "2013-09-09 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "purple"},
    {"id": 18, "title": "testrot", "resourceId": 3, "week": {"date": "2013-09-09 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "red"},
    {"id": 19, "title": "testblau", "resourceId": 2, "week": {"date": "2013-09-16 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "blue"},
    {"id": 20, "title": "test123", "resourceId": 3, "week": {"date": "2013-09-16 00:00:00", "timezone_type": 3, "timezone": "Europe\/Berlin"}, "color": "blue"}
];

tppAppTest.run(function ($httpBackend) {
    console.log('Setting up mocks');
    $httpBackend.whenGET('/api/resource').respond([{"id":1,"name":"Robin"},{"id":2,"name":"Marco"},{"id":3,"name":"Johannes"}]);
    $httpBackend.whenPOST('/api/resource').respond(function (method, url, data) {
//        resources.push(angular.fromJson(data));
    });
    $httpBackend.whenGET(/\/api\/task.+/).respond(tasks);
    $httpBackend.whenPOST('/api/task').respond(function (method, url, data) {
        var task = angular.fromJson(data);
        task['id'] = nextTaskId;
        nextTaskId++;
        tasks.push(task);
        return task;
    });
    $httpBackend.whenGET(/\/views\//).passThrough();
});
