(function () {
  'use strict';

  /*
   * Display Campaign Template Module
   *
   * Template : Expert
   *
   *
   */

  var module = angular.module('core/campaigns/expert');

  module.controller('core/campaigns/expert/EditCampaignController', [
    '$scope', 'lodash', '$log', '$location', '$routeParams', 'core/campaigns/DisplayCampaignService', 'core/campaigns/CampaignPluginService',
    function ($scope, _, $log, $location, $routeParams, DisplayCampaignService, CampaignPluginService) {
      var campaignId = $routeParams.campaign_id;

      function initView() {
        $scope.campaign = DisplayCampaignService.getCampaignValue();
        $scope.adGroups = DisplayCampaignService.getAdGroupValues();

        $scope.inventorySources = DisplayCampaignService.getInventorySources();
      }

      $log.debug('Expert.EditCampaignController called !');

      CampaignPluginService.getCampaignTemplate("com.mediarithmics.campaign.display", "default-template").then(function (template) {
        // TODO load the campaign (no effect if already in cache or if this is a temporary id)
        if (!DisplayCampaignService.isInitialized() || DisplayCampaignService.getCampaignId() !== campaignId) {
          if (!campaignId || DisplayCampaignService.isTemporaryId(campaignId)) {
            DisplayCampaignService.initCreateCampaign(template).then(function () {
              initView();
            });
          } else {
            DisplayCampaignService.initEditCampaign(campaignId, template).then(function () {
              initView();
              DisplayCampaignService.loadAdGroups();
            });
          }
        } else {
          // init scope
          initView();
        }
        $scope.getAds = function (adGroupId) {
          return DisplayCampaignService.getAds(adGroupId);
        };

        $scope.availableInventorySources = DisplayCampaignService.getDisplayNetworkCampaign();

        $scope.isInInventorySources = function (elem) {
          var displayNetworkCampaigns = _.map($scope.inventorySources, function (elem) {
            return "" + elem.display_network_campaign_id;
          });
          return !_.contains(displayNetworkCampaigns, elem.id);
        };

        $scope.addDisplayNetwork = function (elem) {
          if (elem === undefined) {
            return;
          }
          var newInventorySource = {display_network_campaign_id: elem.id, display_network_name: elem.display_network_name};
          $scope.displayNetwork = undefined;
          DisplayCampaignService.addInventorySource(newInventorySource);

        };


        $log.debug('Expert.EditCampaignController adGroups=', $scope.adGroups);

        /*
         * Ad Group Edition
         */

        // new Ad Group
        $scope.newAdGroup = function () {
          var adGroupId = DisplayCampaignService.addAdGroup();
          $location.path('/display-campaigns/expert/edit/'+ campaignId +'/edit-ad-group/' + adGroupId);
        };

        // edit Ad Group
        $scope.editAdGroup = function (adGroup) {
          $location.path('/display-campaigns/expert/edit/'+ campaignId +'/edit-ad-group/' + adGroup.id);
        };


        /*
         * Campaign Edition
         */

        // save button
        $scope.save = function () {
          $log.debug("save campaign : ", $scope.campaign);
          DisplayCampaignService.save().then(function (campaignContainer) {
            $location.path('/display-campaigns/report/' + campaignContainer.id + '/basic');
          });
        };

        // back button
        $scope.cancel = function () {
          DisplayCampaignService.reset();
          if ($scope.campaign && $scope.campaign.id) {
            $location.path('/display-campaigns/report/' + $scope.campaign.id + '/basic');
          } else {
            $location.path('/display-campaigns');
          }

        };


      });
    }
  ]);
})();

