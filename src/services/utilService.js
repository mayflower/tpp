// TODO write unit tests!!
angular.module('tppApp')
  .factory('util', function () {

    var utilFunctions = {

      /**
       *
       * @param {Object} member
       * @returns {Array}
       */
      extractWeekListFromMember: function (member) {
        var weekList = [];

        angular.forEach(member.weekList, function (item) {
          weekList.push(item.number);
        });

        return weekList;
      }

    };

    return utilFunctions;
  });
