/* global _ */
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
    '$scope', '$log', '$location', '$routeParams', 'core/campaigns/DisplayCampaignService',
    function ($scope, $log, $location, $routeParams, DisplayCampaignService) {

      function initView() {
        $scope.campaign = DisplayCampaignService.getCampaignValue();
        $scope.adGroups = DisplayCampaignService.getAdGroupValues();
        if (!DisplayCampaignService.isCreationMode()) {
          DisplayCampaignService.loadAdGroups();

        }
        $scope.inventorySources = DisplayCampaignService.getInventorySources();
      }

      $log.debug('Expert.EditCampaignController called !');

      // TODO oad the campaign (no effect if already in cache or if this is a temporary id)
      if (DisplayCampaignService.isInitialized() || DisplayCampaignService.getCampaignId() !== $routeParams.campaign_id) {
        if (DisplayCampaignService.isTemporaryId($routeParams.campaign_id)) {
          DisplayCampaignService.initCreateCampaign("expert").then(function () {
            initView();
          });
        } else {
          DisplayCampaignService.initEditCampaign($routeParams.campaign_id).then(function () {
            initView();
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
        $location.path('/display-campaigns/expert/edit-ad-group/' + adGroupId);
      };

      // edit Ad Group
      $scope.editAdGroup = function (adGroup) {
        $location.path('/display-campaigns/expert/edit-ad-group/' + adGroup.id);
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
        $location.path('/display-campaigns/report/' + $scope.campaign.id + '/basic');

      };


    }
  ]);
})();

