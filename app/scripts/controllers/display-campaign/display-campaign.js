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

  campaignControllers.controller('DisplayCampaignListController', ['$scope', '$location', 'Restangular', 'DisplayCampaignService',
      function($scope, $location, Restangular, DisplayCampaignService) {

        Restangular.all('campaigns').getList({organisation_id:2}).then(function (campaigns) {
          $scope.campaigns = campaigns;
        });

        $scope.newCampaign = function() {
          $location.path('/display-campaigns/select-campaign-template');
        }

        $scope.editCampaign = function(campaign) {

          console.debug("> editCampaign for campaignId=", campaign.id)

          // get campaign edit template
          var editTemplateView = '/display-campaigns/expert/edit-campaign/';
          DisplayCampaignService.initEditCampaign(campaign.id).then(function(){
            $location.path(editTemplateView + campaign.id);       
          });


        }
    }]);

  /*
   * Campaign 
   */



  campaignControllers.controller('NewDisplayCampaignController', ['$scope', '$location', 'Session','DisplayCampaignService',

      function($scope, $location, Session, DisplayCampaignService) {

        // load display campaign templates


        // create button
        $scope.create = function(template) {
          
          var createTemplateView = '/display-campaigns/expert/edit-campaign/';
          var organisationId = Session.getCurrentWorkspace().organisation_id;

          DisplayCampaignService.initCreateCampaign(template, organisationId).then(function(campaignId){
            console.debug("campaign init , campaign_id = ", campaignId);
            $location.path(createTemplateView + campaignId);
          });

        }

        $scope.cancel = function() {
          $location.path('/display-campaigns');
        }   

  }]);


