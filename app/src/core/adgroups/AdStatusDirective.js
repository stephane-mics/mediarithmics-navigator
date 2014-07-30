define(['./module'], function (module) {
  'use strict';

  module.directive("micsAdStatus", [
    function () {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: "src/core/adgroups/adStatusTemplate.html",
        scope : {
          "ad" : "=micsAdStatus",
          "adGroup" : "=",
          "campaign" : "="
        },
        controller : [
          "$scope", "Restangular",
          function ($scope, Restangular) {

            var updateAdStatus = function (ad, status) {
              Restangular.one("display_campaigns", $scope.campaign.id).one('ad_groups', $scope.adGroup.id).one('ads', ad.id).customPUT({
                status : status,
              }).then(function(returnedAd) {
                ad.status = returnedAd.status;
              });
            };

            $scope.activateAd = function (ad) {
              updateAdStatus(ad, "ACTIVE");
            };

            $scope.pauseAd = function (ad) {
              updateAdStatus(ad, "PAUSED");
            };

          }
        ]
      };
    }
  ]);
});



