angular.module('schnellerApp')
  .factory('dataProvider', function() {
    return [{
      id: 1,
      label: 'eins'
    },{
      label: 'zwei',
      id: 2
    },{
      label: 'drei',
      id: 3
    }]
  });