define(['./module'], function (module) {

  'use strict';


  module.filter('mcsEnumLabel', function () {
      return function (input) {
        return  (input.toLowerCase().charAt(0).toUpperCase() + input.toLowerCase().substring(1)).replace(/_/g, ' ');
      };

    });

  module.filter('mcsConditionOperator', function () {
      return function (input) {
      	if(input === 'INF') {
      		return '<';
      	} else if(input === 'SUP') {
      		return '>';
      	} else if(input === 'EQUAL') {
          return '=';
        } else if(input === 'COPY') {
          return 'Copy value';
        } else if(input === 'NOT_EQUAL') {
          return '≠';
        } else if(input === 'NOT_MATCH') {
          return 'Doesn\'t match';
        } else if(input === 'MATCH') {
          return 'Matches';
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
              if($scope.id) {
	            Restangular.one("queries", $scope.id).all("conditions").getList().then(
	              function (conditions) {
	                $scope.conditions = conditions;
	              }
	            );
              }
	        }
        ]
      };
    }
  ]);
});

