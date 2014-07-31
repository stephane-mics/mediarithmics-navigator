define(['./module'], function () {
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
    '$scope', 'lodash', '$log', '$location', '$stateParams', 'core/campaigns/DisplayCampaignService', 'core/campaigns/CampaignPluginService', "core/common/WaitingService", "core/common/ErrorService",
    function ($scope, _, $log, $location, $stateParams, DisplayCampaignService, CampaignPluginService, waitingService, errorService) {
      var campaignId = $stateParams.campaign_id;

      function initView() {
        $scope.campaign = DisplayCampaignService.getCampaignValue();
        $scope.adGroups = DisplayCampaignService.getAdGroupValues();

        $scope.inventorySources = DisplayCampaignService.getInventorySources();
        $scope.locations = DisplayCampaignService.getLocations();
        $scope.locationSelector = $scope.locations.length ? "custom" : "";
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


        $scope.$on("mics-location:postal-code-added", function (event, params) {
          DisplayCampaignService.addPostalCodeLocation(params);
        });

        $scope.deleteLocation = function (elem) {
          if (elem === undefined) {
            return;
          }
          DisplayCampaignService.removeLocation(elem.id);
          if (!$scope.locations.length) {
            $scope.locationSelector = "";
          }

        };

        $scope.getLocationDescriptor = function (locationList) {
          var descriptor =  _.reduce(locationList, function (str, location) {
            if(str === "") {
              return location.name;
            }
             return str + ", "  +location.name;
          }, "");
          if(descriptor.length > 100) {
            return descriptor.slice(0,100) + "...";
          } else {
            return descriptor;
          }

        };


        $log.debug('Expert.EditCampaignController adGroups=', $scope.adGroups);

        /*
         * Ad Group Edition
         */

        // new Ad Group
        $scope.newAdGroup = function () {
          var adGroupId = DisplayCampaignService.addAdGroup();
          $location.path( '/' +  $scope.campaign.organisation_id + '/campaigns/display/expert/edit/'+ campaignId +'/edit-ad-group/' + adGroupId);
        };

        // edit Ad Group
        $scope.editAdGroup = function (adGroup) {
          $location.path('/' +  $scope.campaign.organisation_id + '/campaigns/display/expert/edit/'+ campaignId +'/edit-ad-group/' + adGroup.id);
        };


        /*
         * Campaign Edition
         */

        // save button
        $scope.save = function () {
          $log.debug("save campaign : ", $scope.campaign);
          waitingService.showWaitingModal();
          DisplayCampaignService.save().then(function (campaignContainer) {
            waitingService.hideWaitingModal();
            DisplayCampaignService.reset();
            $location.path('/' +  $scope.campaign.organisation_id+'/campaigns/display/report/' + campaignContainer.id + '/basic');
          }, function failure(response) {
            waitingService.hideWaitingModal();
            errorService.showErrorModal({
              errorId : response.data.error_id
            }).then(null, function (){
              DisplayCampaignService.reset();
            });
          });
        };

        // back button
        $scope.cancel = function () {
          DisplayCampaignService.reset();
          if ($scope.campaign && $scope.campaign.id) {
            $location.path('/' +  $scope.campaign.organisation_id+'/campaigns/display/report/' + $scope.campaign.id + '/basic');
          } else {
            $location.path('/' +  $scope.campaign.organisation_id+'/campaigns');
          }

        };


      });
    }
  ]);
});

