'use strict';

/*
 * Display Campaign Template Module
 *
 * Template : Expert
 * 
 *  
 */

var expertTemplate = angular.module('expertDisplayCampaignTemplate', ['displayCampaignService']);

expertTemplate.controller('EditExpertController', ['$scope', '$location', '$routeParams', 'DisplayCampaignService',

    function($scope, $location, $routeParams, DisplayCampaignService) {

      // get campaign
      DisplayCampaignService.getCampaignValue($routeParams.campaign_id).then(function (campaign) {
      	$scope.campaign = campaign;
      });


      // save button
      $scope.save = function() {      
        console.debug("save campaign : ", $scope.campaign);
        DisplayCampaignService.setCampaignValue($scope.campaign);
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