'use strict';

angular.module(
    'tpp.utils', []
).factory('dateUtil', function () {

    return {
        'getWeekList': function (weeks) {
            var weekList = [];
            var week = moment(weeks.date).startOf('week');

            for (var i = 0; i < weeks.numWeeks; i++) {
                weekList.push(moment(week));
                week.add('w', 1);
            }

            return weekList;
        }
    }
});
