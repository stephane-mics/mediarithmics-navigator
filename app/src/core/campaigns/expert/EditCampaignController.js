define(['./module', 'moment'], function (module, moment) {
  'use strict';

  /**
   * Display Campaign Template Module
   * Template : Expert
   */

  module.controller('core/campaigns/expert/EditCampaignController', [
    '$scope', 'lodash', '$log', '$location', '$stateParams', 'core/campaigns/DisplayCampaignService', 'core/campaigns/CampaignPluginService', "core/common/WaitingService", "core/common/ErrorService", "$modal",
    function ($scope, _, $log, $location, $stateParams, DisplayCampaignService, CampaignPluginService, waitingService, errorService, $modal) {
      var campaignId = $stateParams.campaign_id;

        function updateGoalSelectionsCount() {
          $scope.simpleGoals = _.filter(DisplayCampaignService.getGoalSelections(), {"goal_selection_type":"CLICK_ON_AD"});
          return ;
        }


      function initView() {
        $scope.moreGoals = false;
        $scope.campaign = DisplayCampaignService.getCampaignValue();
        $scope.adGroups = DisplayCampaignService.getAdGroupValues();
        $scope.inventorySources = DisplayCampaignService.getInventorySources();
        $scope.goalSelections = DisplayCampaignService.getGoalSelections();
        $scope.defaultGoalSelection = _.find(DisplayCampaignService.getGoalSelections(), {"default":true});
        updateGoalSelectionsCount();
        $scope.locations = DisplayCampaignService.getLocations();

        $scope.locationSelector = $scope.locations.length ? "custom" : "";
        $scope.schedule = $scope.campaign.start_date !== null ? "custom" : "";
        if ($scope.campaign.start_date !== null && $scope.campaign.end_date !== null) {
          $scope.campaignDateRange = {
            startDate: moment($scope.campaign.start_date),
            endDate: moment($scope.campaign.end_date)
          };
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

        $scope.toggleMoreGoals = function () {
          $scope.moreGoals = !$scope.moreGoals ;
          return;
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
          var displayNetworkAccesses = _.map($scope.inventorySources, function (elem) {
            return "" + elem.display_network_access_id;
          });
          return !_.contains(displayNetworkCampaigns, elem.id);
        };

        $scope.chooseDisplayNetworks = function () {
          $modal.open({
            templateUrl: 'src/core/campaigns/ChooseExistingDisplayNetwork.html',
            scope: $scope,
            backdrop: 'static',
            controller: 'core/campaigns/ChooseExistingDisplayNetworkController',
            size: "lg"
          });
        };

        $scope.addGoal = function (type) {
          if(type == 'CONVERSION') {
            $modal.open({
              templateUrl: 'src/core/goals/ChooseExistingGoal.html',
              scope: $scope,
              backdrop: 'static',
              controller: 'core/goals/ChooseExistingGoalController',
              size: "lg"
            });
          } else {
            DisplayCampaignService.addGoalSelection({'goal_selection_type':type});
          }
           updateGoalSelectionsCount();

        };

        $scope.$on("mics-goal:selected", function (event, goal) {
          DisplayCampaignService.addGoalSelection({'goal_selection_type':'CONVERSION',"goal_id": goal.id, 'goal_name': goal.name});
          updateGoalSelectionsCount();
        });

        $scope.updateDefaultGoalSelection = function () {
          
          _.forEach(DisplayCampaignService.getGoalSelections(), function(gs) {gs.default=false; return;})
          $scope.defaultGoalSelection.default=true
          return ;

        }


        $scope.removeInventorySource = function (source) {
          DisplayCampaignService.removeInventorySource(source);
        };

        $scope.removeGoalSelection = function (goalSelection) {
          DisplayCampaignService.removeGoalSelection(goalSelection);
          updateGoalSelectionsCount();
        };

        $scope.$on("mics-inventory-source:selected", function (event, inventorySource) {
          DisplayCampaignService.addInventorySource({
            display_network_access_id: inventorySource.id,
            display_network_name: inventorySource.display_network_name,
            display_network_access_name: inventorySource.name,
            display_network_access_deal_id: inventorySource.deal_id
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
          var descriptor = _.reduce(locationList, function (str, location) {
            if (str === "") {
              return location.name;
            }
            return str + ", " + location.name;
          }, "");
          if (descriptor.length > 100) {
            return descriptor.slice(0, 100) + "...";
          } else {
            return descriptor;
          }
        };


        $log.debug('Expert.EditCampaignController adGroups=', $scope.adGroups);

        /**
         * Ad Group Edition
         */

          // New Ad Group
        $scope.newAdGroup = function () {
          var adGroupId = DisplayCampaignService.addAdGroup();
          $location.path('/' + $scope.campaign.organisation_id + '/campaigns/display/expert/edit/' + campaignId + '/edit-ad-group/' + adGroupId);
        };

        // Edit Ad Group
        $scope.editAdGroup = function (adGroup) {
          $location.path('/' + $scope.campaign.organisation_id + '/campaigns/display/expert/edit/' + campaignId + '/edit-ad-group/' + adGroup.id);
        };

        $scope.removeAdGroup = function (adGroup) {
          DisplayCampaignService.removeAdGroup(adGroup.id);
          // TODO find a way to let angular handle that automatically.
          $scope.adGroups = DisplayCampaignService.getAdGroupValues();
        };


        /**
         * Campaign Edition
         */

          // Save button
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
            $location.path('/' + $scope.campaign.organisation_id + '/campaigns/display/report/' + campaignContainer.id + '/basic');
          }, function failure(response) {
            waitingService.hideWaitingModal();
            errorService.showErrorModal({
              error: response
            }).then(null, function () {
              DisplayCampaignService.reset();
            });
          });
        };

        // back button
        $scope.cancel = function () {
          DisplayCampaignService.reset();
          if ($scope.campaign && $scope.campaign.id) {
            $location.path('/' + $scope.campaign.organisation_id + '/campaigns/display/report/' + $scope.campaign.id + '/basic');
          } else {
            $location.path('/' + $scope.campaign.organisation_id + '/campaigns');
          }
        };
      });
    }
  ]);
});

