'use strict';

angular.module(
    'tpp.utils', []
).factory('weekList', function () {

    var weekList = [];

    var week = moment().startOf('week');

    for (var i = 0; i < 7; i++) {
        weekList.push({
            number: week.week(),
            date: moment(week)
        });

        week.add('w', 1);
    }

    return weekList;
});
