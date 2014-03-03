'use strict';

/*
 * Display Campaign Template Module
 *
 * Template : Expert
 * 
 *  
 */

var expertTemplate = angular.module('expertDisplayCampaignTemplate', ['displayCampaignService']);

expertTemplate.controller('Expert.EditCampaignController', ['$scope', '$location', '$routeParams', 'DisplayCampaignService',

    function($scope, $location, $routeParams, DisplayCampaignService) {

      console.debug('Expert.EditCampaignController called !');

      // TODO oad the campaign (no effect if already in cache or if this is a temporary id)


      // init scope
      $scope.campaign = DisplayCampaignService.getCampaignValue();      
      $scope.adGroups = DisplayCampaignService.getAdGroupValues();
            

      console.debug('Expert.EditCampaignController adGroups=', $scope.adGroups);

      // new Ad Group
      $scope.newAdGroup = function () {
        var adGroupId = DisplayCampaignService.addAdGroup();
        $location.path('/display-campaigns/expert/edit-ad-group/'+adGroupId);
      }

      // save button
      $scope.save = function() {      
        console.debug("save campaign : ", $scope.campaign);
        DisplayCampaignService.save().then(function() {
          $location.path('/display-campaigns');
        });
      }


      // back button
      $scope.cancel = function() {
        DisplayCampaignService.reset();
        $location.path('/display-campaigns');

      }
   	 
   		
   	}]);

expertTemplate.controller('Expert.EditAdGroupController', ['$scope', '$location', '$routeParams', 'DisplayCampaignService',

    function($scope, $location, $routeParams, DisplayCampaignService) {

      var adGroupId = $routeParams.ad_group_id;

      $scope.campaignName = DisplayCampaignService.getCampaignValue().name;

      // get campaign
      $scope.adGroup = DisplayCampaignService.getAdGroupValue($routeParams.ad_group_id);      
     
      // save button
      $scope.done = function() {      

        console.debug("Editing Ad Group done! :", $scope.adGroup);
        
        DisplayCampaignService.setAdGroupValue(adGroupId, $scope.adGroup);
        $location.path('/display-campaigns/expert/edit-campaign/'+DisplayCampaignService.getCampaignId());
        
      }


      // back button
      $scope.cancel = function() {

        console.debug("Reset Ad Group");

        DisplayCampaignService.resetAdGroup(adGroupId);

        //DisplayCampaignService.resetAdGroupValue();
        $location.path('/display-campaigns/expert/edit-campaign/'+DisplayCampaignService.getCampaignId());

      }     
    }]);