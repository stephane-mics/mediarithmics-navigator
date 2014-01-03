'use strict';

/*
 * Campaign Controllers Module
 * 
 * this module provides controllers needed to manage campaigns
 * - campaign list
 * - campaign editor
 *  
 */

 var campaignControllers = angular.module('CampaignControllers', []);

 /*
  * Campaign list controller
  */

  campaignControllers.controller('CampaignListCtrl', ['$scope', 'Campaign',
  	function($scope, Campaign) {
  		$scope.campaigns = Campaign.query();
  	}]);

  /*
   * Campaign 
   */

   campaignControllers.controller('CampaignCtrl', ['$scope', 'Campaign',
   	function($scope, Campaign) {
   		$scope.campaign = Campaign.get({campaignId:$routeParams.campaignId})
   	}]);

