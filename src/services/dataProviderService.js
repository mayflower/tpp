angular.module('tppApp')
  .factory('dataProvider', function () {

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

    var memberList = [
      {
        name: 'Johannes',
        weekList: weekList
      },
      {
        name: 'Simon',
        weekList: weekList
      },
      {
        name: 'Micha',
        weekList: weekList
      },
      {
        name: 'Sebastian',
        weekList: weekList
      },
      {
        name: 'Marco',
        weekList: weekList
      },
      {
        name: 'Markus',
        weekList: weekList
      }
    ];

    return { memberList: memberList }
  });
