define(['./module','moment'], function (m, moment) {
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
    '$scope', 'lodash', '$log', '$location', '$stateParams', 'core/campaigns/DisplayCampaignService', 'core/campaigns/CampaignPluginService', "core/common/WaitingService", "core/common/ErrorService", "$modal",
    function ($scope, _, $log, $location, $stateParams, DisplayCampaignService, CampaignPluginService, waitingService, errorService, $modal) {
      var campaignId = $stateParams.campaign_id;

      function initView() {
        $scope.campaign = DisplayCampaignService.getCampaignValue();
        $scope.adGroups = DisplayCampaignService.getAdGroupValues();

        $scope.inventorySources = DisplayCampaignService.getInventorySources();
        $scope.locations = DisplayCampaignService.getLocations();
        $scope.locationSelector = $scope.locations.length ? "custom" : "";
        $scope.schedule = $scope.campaign.start_date !== null ? "custom" : "";
        if($scope.campaign.start_date !== null && $scope.campaign.end_date !== null ) {
          $scope.campaignDateRange = {startDate: moment($scope.campaign.start_date), endDate: moment($scope.campaign.end_date)};
        }

      }
      $scope.campaignDateRange = {startDate: moment(), endDate: moment().add(20, 'days')};
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
        $scope.getUserGroups = function (adGroupId) {
          return DisplayCampaignService.getUserGroups(adGroupId);
        };
        $scope.getKeywordLists = function (adGroupId) {
          return DisplayCampaignService.getKeywordLists(adGroupId);
        };
        $scope.getPlacementLists = function (adGroupId) {
          return DisplayCampaignService.getPlacementLists(adGroupId);
        };

        $scope.isInInventorySources = function (elem) {
          var displayNetworkCampaigns = _.map($scope.inventorySources, function (elem) {
            return "" + elem.display_network_campaign_id;
          });
          return !_.contains(displayNetworkCampaigns, elem.id);
        };

        $scope.chooseDisplayNetworks = function() {
          $modal.open({
            templateUrl: 'src/core/campaigns/ChooseExistingDisplayNetwork.html',
            scope : $scope,
            backdrop : 'static',
            controller: 'core/campaigns/ChooseExistingDisplayNetworkController',
            size: "lg"
          });
        };

        $scope.removeInventorySource = function (source) {
          DisplayCampaignService.removeInventorySource(source);
        };

        $scope.$on("mics-inventory-source:selected", function (event, inventorySource) {
          DisplayCampaignService.addInventorySource({
            display_network_campaign_id : inventorySource.id,
            display_network_name : inventorySource.display_network_name
          });
        });

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

        $scope.removeAdGroup = function (adGroup) {
          DisplayCampaignService.removeAdGroup(adGroup.id);
          // TODO find a way to let angular handle that automatically.
          $scope.adGroups = DisplayCampaignService.getAdGroupValues();
        };


        /*
         * Campaign Edition
         */

        // save button
        $scope.save = function () {
          if ($scope.schedule === 'custom') {
            $scope.campaign.start_date = $scope.campaignDateRange.startDate.valueOf();
            $scope.campaign.end_date = $scope.campaignDateRange.endDate.valueOf();
          } else {
            $scope.campaign.start_date = null;
            $scope.campaign.end_date = null;
          }


          $log.debug("save campaign : ", $scope.campaign);
          waitingService.showWaitingModal();
          DisplayCampaignService.save().then(function (campaignContainer) {
            waitingService.hideWaitingModal();
            DisplayCampaignService.reset();
            $location.path('/' +  $scope.campaign.organisation_id+'/campaigns/display/report/' + campaignContainer.id + '/basic');
          }, function failure(response) {
            waitingService.hideWaitingModal();
            errorService.showErrorModal({
              error: response
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

