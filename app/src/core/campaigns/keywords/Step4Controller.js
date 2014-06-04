(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step4Controller', [
    "$scope", "$window", "lodash", "core/common/auth/Session", 'core/campaigns/DisplayCampaignService', "$log", "$location", "$q", "Restangular", "async",
    function ($scope, $window, _, Session, DisplayCampaignService, $log, $location, $q, Restangular, async) {

      /**
       * Bind a promise to a callback : call the callback when the promise is resolved.
       * @param {$q} promise the angular promise
       * @param {Function} callback the function(err, res) to call.
       */
      function bindPromiseCallback(promise, callback) {
        promise.then(function (res) {
          callback(null, res);
        }, function(err) {
          callback(err, null);
        });
      }

      function handleKeywordList(campaignContainer, keywordsListContainer) {
        keywordsListContainer.keywordList.name = campaignContainer.name;
        return keywordsListContainer.save().then(function (kwList) {
          DisplayCampaignService.addKeywordList($scope.adGroupId, {
            keyword_list_id : kwList.id
          });
        });
      }

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

        var promise = handleKeywordList(campaign, $scope.keywordsList).then(_.bind(DisplayCampaignService.save, DisplayCampaignService));

        promise.then(function success(campaignContainer){
          $log.info("success");
          $location.path("/campaigns/display/report/" + campaignContainer.id + "/basic");
          DisplayCampaignService.reset();
        }, function failure(){
          $log.info("failure");
        });

        // $window.alert("DONE");
      };
    }
  ]);
})();


