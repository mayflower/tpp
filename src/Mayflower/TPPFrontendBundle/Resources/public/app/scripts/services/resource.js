'use strict';

angular.module(
    'tpp.services', ['ngResource']
).factory('Resource', function ($resource) {

//        var resourceList = [
//            {
//                name: 'Johannes',
//                weekList: weekList
//            },
//            {
//                name: 'Simon',
//                weekList: weekList
//            },
//            {
//                name: 'Micha',
//                weekList: weekList
//            },
//            {
//                name: 'Sebastian',
//                weekList: weekList
//            },
//            {
//                name: 'Marco',
//                weekList: weekList
//            },
//            {
//                name: 'Markus',
//                weekList: weekList
//            }
//        ];

    return $resource('/resource/:resourceId', {resourceId:'@id'});

}).service('weekList', function () {
    return [
        {
            number: 30
        },
        {
            number: 31
        },
        {
            number: 32
        },
        {
            number: 33
        },
        {
            number: 34
        },
        {
            number: 35
        },
        {
            number: 36
        }
    ];
});
