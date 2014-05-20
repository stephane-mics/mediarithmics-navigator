(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/MainController', [
    "$scope", 'core/campaigns/CampaignContainer', 'core/campaigns/DisplayCampaignService',
    function ($scope, CampaignContainer, DisplayCampaignService) {
      // $scope.campaign = new CampaignContainer();
      DisplayCampaignService.initCreateCampaign("expert");
      $scope.campaign = DisplayCampaignService.getCampaignValue();
      $scope.adGroupId = DisplayCampaignService.addAdGroup();
      $scope.adGroup = DisplayCampaignService.getAdGroupValue($scope.adGroupId);

      $scope.keywordsList = {
        expressionList : []
      };
      DisplayCampaignService.addKeywordList($scope.adGroupId, $scope.keywordsList);

      $scope.campaign.template_group_id = "com.mediarithmics.campaign.display";
      $scope.campaign.template_artifact_id = "keywords-targeting-template";

      // TODO
      $scope.campaign.currency_code = "EUR";
      $scope.campaign.max_budget_period = "WEEK";


      $scope.container = {
        step : "step1"
      };
    }
  ]);
})();


