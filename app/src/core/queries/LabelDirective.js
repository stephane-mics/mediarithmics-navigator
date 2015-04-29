define(['./module'], function (module) {

  'use strict';


  module.filter('mcsEnumLabel', function () {
      return function (input) {
        return  (input.toLowerCase().charAt(0).toUpperCase() + input.toLowerCase().substring(1)).replace(/_/g, ' ');
      };

    });

  module.filter('mcsConditionOperator', function () {
      return function (input) {
      	if(input == 'INF') {
      		return '<';
      	} else if(input == 'SUP') {
      		return '>';
      	} else if(input == 'EQUAL') {
      		return '=';
      	}
        return  input;
      };

    });

  module.directive('mcsQueryDisplay', [ 
    function () {
      return {
      	templateUrl: '/src/core/queries/query-display-info.html',
      	restrict: 'EA',
      	scope: {
          "id": "=mcsQueryDisplay"
        },
        controller: [ "$scope", "Restangular",
        	function ($scope, Restangular) {
	            Restangular.one("queries", $scope.id).all("conditions").getList().then(
	              function (conditions) {
	                $scope.conditions = conditions;
	              }
	            );
	        }
        ]
      };
    }
  ]);
});

