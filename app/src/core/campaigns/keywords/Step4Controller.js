(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step4Controller', [
    "$scope", "$window", "lodash", "core/common/auth/Session", 'core/campaigns/DisplayCampaignService', "$log", "$location",
    function ($scope, $window, _, Session, DisplayCampaignService, $log, $location) {


      $scope.getAds = function (adGroupId) {
        return DisplayCampaignService.getAds(adGroupId);
      };


      $scope.previous = function () {
        $scope.container.step = "step3";
      };

      $scope.editBudget = $scope.editLocation = function() {
        $scope.container.step = "step1";
      };

      $scope.editKeywordsList = function () {
        $scope.container.step = "step2";
      };

      $scope.editPlacement = function () {
        $scope.container.step = "step3";
      };

      $scope.next = function () {
        var campaign = $scope.campaign;

        // var adGroupId = $scope.campaign.addAdGroup();
        // var adGroup = $scope.campaign.getAdGroup(adGroupId);
        // adGroup.name = $scope.campaign.name;
        // _.forEach($scope.campaign.creatives, function (creative) {
          // adGroup.addAd({
            // creative_id: creative.id
          // });
        // });

        var promise = DisplayCampaignService.save();

        promise.then(function success(campaignContainer){
          $log.info("success");
          $location.path("/display-campaigns/report/" + campaignContainer.id + "/basic");
          DisplayCampaignService.reset();
        }, function failure(){
          $log.info("failure");
        });

        // $window.alert("DONE");
      };
    }
  ]);
})();


