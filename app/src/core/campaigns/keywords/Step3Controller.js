(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step3Controller', [
    "$scope", "$log", "Restangular", "lodash", 'core/campaigns/DisplayCampaignService',
    function ($scope, $log, Restangular, _, DisplayCampaignService) {

      var adGroupId = $scope.adGroupId;

      $scope.getAds = function (adGroupId) {
        return DisplayCampaignService.getAds(adGroupId);
      };

      $scope.deleteAd = function (adId) {
        return DisplayCampaignService.removeAd(adGroupId, adId);
      };

      $scope.deleteCreative = function (eltToDelete) {

        var idx = $scope.campaign.creatives.indexOf(eltToDelete);
        if(idx === -1) {
          $log.warn("micsListCreatives: trying to delete an unknown elt", eltToDelete);
          return;
        }

        $scope.campaign.creatives.splice(idx, 1);
      };


      $scope.$on("mics-creative:selected", function (event, params) {
        var existing = _.find($scope.campaign.creatives, function (crea) {return crea.id === params.creative.id;});
        if(!existing) {
          // $scope.campaign.creatives.push(params.creative);
          var ad  = {creative_id: params.creative.id};
          DisplayCampaignService.addAd(adGroupId, ad);
        }
      });

      $scope.previous = function () {
        $scope.container.step = "step2";
      };

      $scope.next = function () {
        $scope.container.step = "step4";
      };

      $scope.resolveUrlTarget = _.memoize(function (creativeId) {
        if(!creativeId) {
          return "";
        }

        var result = {url:""};
        Restangular.one("display_ads", creativeId).one("renderer_properties").getList().then(function(properties) {
          var dest = _.find(properties, function (elt) {return elt.technical_name === "destination_url";});
          if(dest) {
            result.url = dest.value.url;
          }
        });
        return result;
      });
    }
  ]);
})();


