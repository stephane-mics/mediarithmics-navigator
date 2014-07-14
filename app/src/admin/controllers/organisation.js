define(['navigator'], function (navigator) {
'use strict';

navigator.register.controller('OrganisationListController', ['$scope', '$location', 'Restangular',
	function($scope, $location, restangular) {

		$scope.organisations = restangular.all('organisations').getList().$object;

		$scope.create = function() {
			$location.path('/admin/new-organisation');
		}

	}]);


navigator.register.controller('OrganisationEditionController', ['$scope', '$location', '$routeParams', 'Restangular',
	function($scope, $location, $routeParams, restangular) {


		// load market list
		restangular.all('markets').getList().then(function(markets) {
			for(var i=0; i<markets.length; i++) {
				markets[i].label = markets[i].country_iso + " - " + markets[i].customer_type;
			}
			$scope.markets = markets	
		});

		// load organisation
		restangular.one('organisations', $routeParams.id).get().then(function (organisation){
			$scope.organisation = organisation;
		});


		// save button
		$scope.save = function() {			
			console.debug("save organisation : ", $scope.organisation);
			$scope.organisation.put();
		}

		// remove button
		$scope.remove = function() {
			console.debug("remove organisation : ", $scope.organisation);
			$scope.organisation.remove().then(function() {
				$location.path('/organisations');
			});
		}


		$scope.back = function() {
			$location.path('/organisations')
		}

	}]);


navigator.register.controller('OrganisationCreationController', ['$scope', '$location', '$routeParams', 'Restangular',
	function($scope, $location, $routeParams, restangular) {


		// load market list
		restangular.all('markets').getList().then(function(markets) {
			for(var i=0; i<markets.length; i++) {
				markets[i].label = markets[i].country_iso + " - " + markets[i].customer_type;
			}
			$scope.markets = markets;
		});


		// create button
		$scope.create = function() {
			console.debug("create organisation : ", $scope.organisation);
			restangular.all("organisations").post($scope.organisation).then(function(organisation) {
				$location.path('/organisations/'+organisation.id);
			});
		}

		$scope.cancel = function() {
			$location.path('/organisations');
		}

	}]);

  navigator.config(["$routeProvider", "$logProvider",
    function ($routeProvider, $logProvider) {
      $routeProvider.when(
        "/admin/new-organisation", {
            templateUrl: 'src/admin/views/organisation-creation.html'
        });
    
      $logProvider.debugEnabled(true);
    }
  ]);

});