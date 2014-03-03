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

        Restangular.all('campaigns').getList({organisation_id:2}).then(function (campaigns) {
          $scope.campaigns = campaigns;
        });

        $scope.newCampaign = function() {
          $location.path('/display-campaigns/new-campaign');
        }
    }]);

  /*
   * Campaign 
   */



  campaignControllers.controller('NewDisplayCampaignController', ['$scope', '$location', 'DisplayCampaignService',

      function($scope, $location, DisplayCampaignService) {

        // load display campaign templates


        // create button
        $scope.create = function(template) {
          
          var createTemplateView = '/display-campaigns/new-expert/';
          DisplayCampaignService.initCreateCampaign(template).then(function(campaignId){
            console.debug("campaign init , campaign_id = ", campaignId);
            $location.path(createTemplateView + campaignId);
          });

        }

        $scope.cancel = function() {
          $location.path('/display-campaigns');
        }   

  }]);


