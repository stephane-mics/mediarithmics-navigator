(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/MainController', [
    "$scope", 'core/campaigns/DisplayCampaignContainer', 'core/campaigns/DisplayCampaignService', '$routeParams', 'core/campaigns/CampaignPluginService', 'lodash', 'Restangular', 'core/keywords/KeywordListContainer',
    function ($scope, DisplayCampaignContainer, DisplayCampaignService, $routeParams, CampaignPluginService, _, Restangular, KeywordListContainer) {
      var campaignId = $routeParams.campaign_id;

      function initView () {
        $scope.campaign = DisplayCampaignService.getCampaignValue();

        $scope.isCreationMode = DisplayCampaignService.isCreationMode();

        var adgroups = DisplayCampaignService.getAdGroupValues();
        if (adgroups.length !== 0) {
          $scope.adGroup = adgroups[0];
          $scope.adGroupId = $scope.adGroup.id;
        } else {
          $scope.adGroupId = DisplayCampaignService.addAdGroup();
          $scope.adGroup = DisplayCampaignService.getAdGroupValue($scope.adGroupId);
        }

        $scope.keywordsList = new KeywordListContainer();
        var keywordListSelections = DisplayCampaignService.getKeywordLists($scope.adGroupId);
        // In this channel, we don't update keyword list selections but directly keyword list expressions and keyword lists.
        // See the last step for the details.
        if (keywordListSelections.length !== 0) {
          $scope.keywordsListId = keywordListSelections[0].keyword_list_id;
          $scope.keywordsList.load($scope.keywordsListId);
        }

        // TODO
        $scope.campaign.currency_code = "EUR";
        $scope.campaign.max_budget_period = "WEEK";
      }

      CampaignPluginService.getCampaignTemplate("com.mediarithmics.campaign.display", "keywords-targeting-template").then(function (template) {
        // TODO load the campaign (no effect if already in cache or if this is a temporary id)
        if (!DisplayCampaignService.isInitialized() || DisplayCampaignService.getCampaignId() !== campaignId) {
          if (!campaignId || DisplayCampaignService.isTemporaryId(campaignId)) {
            DisplayCampaignService.initCreateCampaign(template).then(function () {
              initView();
            });
          } else {
            DisplayCampaignService
            .initEditCampaign(campaignId, template)
            .then(_.bind(DisplayCampaignService.loadAdGroups, DisplayCampaignService)).then(function () {
              initView();
            });
          }
        }
      });


      $scope.container = {
        step : "step1"
      };
    }
  ]);
})();


