'use strict';

/*
 * Campaign Controllers Module
 * 
 * this module provides controllers needed to manage campaigns
 * - campaign list
 * - campaign editor
 *  
 */

 var campaignControllers = angular.module('displayCampaignControllers', ['restangular']);

 /*
  * Campaign list controller
  */

  campaignControllers.controller('DisplayCampaignListController', ['$scope', '$location', 'Restangular',
      function($scope, $location, Restangular) {

        $scope.organisations = Restangular.all('campaigns').getList({organisation_id:2}).$object;

        $scope.create = function() {
          $location.path('/new-display-campaign');
        }
    }]);

  /*
   * Campaign 
   */

   campaignControllers.controller('DisplayCampaignEditionController', ['$scope', '$location', '$routeParams', 'Restangular',

    function($scope, $location, $routeParams, Restangular) {

      // load campaign
      Restangular.one('campaigns/',$routeParams.campaign_id).get().then(function (campaign){
        $scope.campaign = campaign;
      });


      // save button
      $scope.save = function() {      
        console.debug("save campaign : ", $scope.campaign);
        $scope.campaign.put();
      }

      // remove button
      $scope.remove = function() {
        console.debug("remove campaign : ", $scope.campaign);
        $scope.campaign.remove().then(function() {
          $location.path('/display-campaigns');
        });
      }

      // back button
      $scope.back = function() {
        $location.path('/display-campaigns')
      }
   	 
   		
   	}]);

  campaignControllers.controller('DisplayCampaignCreationController', ['$scope', '$location', 'Restangular',

      function($scope, $location, Restangular) {

        // create button
        $scope.create = function() {
          Restangular.all("campaigns/").post($scope.market, {organisation_id: 2}).then(function(market) {
            console.debug("market created : ", market);
            $location.path('/campaigns/'+market.id);
          });
        }

        $scope.cancel = function() {
          $location.path('/campaigns');
        }   

  }]);
