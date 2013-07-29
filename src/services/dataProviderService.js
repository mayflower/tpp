angular.module('tppApp')
  .factory('dataProvider', function () {

    var memberList = [
      {
        name: 'Johannes'
      },
      {
        name: 'Simon'
      },
      {
        name: 'Micha'
      },
      {
        name: 'Sebastian'
      },
      {
        name: 'Marco'
      },
      {
        name: 'Markus'
      }
    ];

    var weekList = [
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

    return { memberList: memberList, weekList: weekList }
  })
;
