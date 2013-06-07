angular.module('schnellerApp')
  .factory('dataProvider', function() {
        return [
            {
                ipid: '123-456-789',
                approvable: false,
                approvedBy: "Hans Wurst",
                exceededSince: 120,
                provider: "Ajax inc.",
                status: 'On Hold',
                price: 123.12
            },
            {
                ipid: '123-456-792',
                approvable: true,
                approvedBy: null,
                exceededSince: 128,
                provider: "Banana inc.",
                status: "Accepted",
                price: 23.10
            },
            {
                ipid: '223-456-780',
                approvable: false,
                approvedBy: "Andi Gewehre",
                exceededSince: 120,
                provider: "CMax ltd.",
                status: 'On Hold',
                price: 1823.12
            },
            {
                ipid: '23-456-789',
                approvable: true,
                approvedBy: null,
                exceededSince: -20,
                provider: "Ajax inc.",
                status: 'On Hold',
                price: 123.12
            }
        ]
  });
