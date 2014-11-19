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

  module.controller('core/campaigns/expert/EditAdGroupController', [
    '$scope', '$location', '$stateParams', '$modal', '$log', 'core/campaigns/DisplayCampaignService','core/common/ConstantsService', 'lodash',
    function($scope, $location, $stateParams, $modal, $log, DisplayCampaignService, ConstantsService, _) {

      var adGroupId = $stateParams.ad_group_id;
      var organisationId = $stateParams.organisation_id;
      var campaignId = $stateParams.campaign_id;
      if(!DisplayCampaignService.isInitialized() || DisplayCampaignService.getCampaignId() !== campaignId) {
        return $location.path("/"+organisationId+"/campaigns/display/expert/edit/"+campaignId);
      }

      $scope.visibilityValues = ConstantsService.getValues("adgroup_visibility");

      $scope.campaignName = DisplayCampaignService.getCampaignValue().name;

      // get campaign
      $scope.adGroup = DisplayCampaignService.getAdGroupValue(adGroupId);

      // fo the keywords controller
      // $scope.keywordsList =
      $scope.getAds = function (adGroupId) {
        return DisplayCampaignService.getAds(adGroupId);
      };

      $scope.deleteAd = function (adId) {
        return DisplayCampaignService.removeAd(adGroupId, adId);
      };

      $scope.getUserGroups = function (adGroupId) {
        return DisplayCampaignService.getUserGroups(adGroupId);
      };

      $scope.getKeywordLists = function (adGroupId) {
        return DisplayCampaignService.getKeywordLists(adGroupId);
      };

      $scope.deleteKeywordList = function (keywordList) {
        return DisplayCampaignService.removeKeywordList(adGroupId, keywordList);
      };

      $scope.getPlacementLists = function (adGroupId) {
        return DisplayCampaignService.getPlacementLists(adGroupId);
      };

      $scope.deletePlacementList = function (placementList) {
        return DisplayCampaignService.removePlacementList(adGroupId, placementList);
      };

      $scope.deleteUserGroup = function (userGroup) {
        return DisplayCampaignService.removeUserGroup(adGroupId, userGroup);
      };

      $scope.getBidOptimizer = function (adGroupId) {
        return DisplayCampaignService.getBidOptimizer(adGroupId);
      };

      $scope.$on("mics-user-group:selected", function (event, params) {
        var existing = _.find(DisplayCampaignService.getUserGroups(adGroupId), function (userGroupSelection) {return userGroupSelection.user_group_id === params.usergroup.id;});
        if(!existing) {
          var userGroupSelection = {
            user_group_id : params.usergroup.id,
            name : params.usergroup.name,
            technical_name : params.usergroup.technicalName,
            exclude : params.exclude
          };
          DisplayCampaignService.addUserGroup(adGroupId, userGroupSelection);
        }
      });

      $scope.$on("mics-keyword-list:selected", function (event, params) {
        DisplayCampaignService.addKeywordList(adGroupId, {
          keyword_list_id : params.keywordList.id
        });
      });

      $scope.$on("mics-bid-optimizer:selected", function (event, params) {
        if(params.bidOptimizer === null) {
          $scope.adGroup.bid_optimization_objective_value = null;
          $scope.adGroup.bid_optimization_objective_type = null;
          $scope.adGroup.bid_optimizer_id = null;
        } else {
          $scope.adGroup.bid_optimizer_id = params.bidOptimizer.id;
        }
      });

      $scope.$on("mics-placement-list:selected", function (event, params) {
        DisplayCampaignService.addPlacementList(adGroupId, {
          placement_list_id : params.placementList.id,
          exclude : params.exclude
        });
      });

      $scope.$on("mics-creative:selected", function (event, params) {
        var ad  = {creative_id: params.creative.id};
//        $scope.campaign.creatives.push(params.creative);
        DisplayCampaignService.addAd(adGroupId, ad);
      });

      // save button
      $scope.done = function() {

        $log.debug("Editing Ad Group done! :", $scope.adGroup);

        DisplayCampaignService.setAdGroupValue(adGroupId, $scope.adGroup);
        $location.path('/' +  DisplayCampaignService.getCampaignValue().organisation_id  +'/campaigns/display/expert/edit/'+DisplayCampaignService.getCampaignId());

      };


      // back button
      $scope.cancel = function() {

        $log.debug("Reset Ad Group");

        DisplayCampaignService.resetAdGroup(adGroupId);

        //DisplayCampaignService.resetAdGroupValue();
        $location.path('/' +  DisplayCampaignService.getCampaignValue().organisation_id+ '/campaigns/display/expert/edit/'+DisplayCampaignService.getCampaignId());

      };

      /*
         $scope.uploader = new plupload.Uploader({
runtimes:'html5,flash,html4',
browse_button: 'browse',
container: 'uploadContainer',
url: "/upload/",
flash_swf_url: 'bower_components/plupload/Moxie.swf',
silverlight_xap_url: 'bower_components/js/external/plupload/Moxie.xap',
filters : {
max_file_size : '200kb',
mime_types: [
{title : "Image files", extensions : "jpg,png"},
{title : "Flash files", extensions : "swf"}
]
}
});

$scope.uploader.bind('Error', function (up, args) {
$log.debug("Error", args);
});

$scope.uploader.bind('PostInit', function (up, params) {
$log.debug('Init plupload, params = ' + params);
});

$scope.uploader.init();
*/
    }
  ]);

});

