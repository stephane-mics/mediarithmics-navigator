define(['./module'], function (module) {
  'use strict';

  module.directive("micsCampaignStatus", [
    function () {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: "src/core/campaigns/campaignStatusTemplate.html",
        scope : {
          "campaign" : "=micsCampaignStatus"
        },
        controller : [
          "$scope", "Restangular",
          function ($scope, Restangular) {

            var updateCampaignStatus = function (campaign, status) {
              Restangular.one("display_campaigns", campaign.id).customPUT({
                status : status,
                type : "DISPLAY" // XXX this is used server side to find the right subclass of CampaignResource
              }).then(function(returnedCampaign) {
                campaign.status = returnedCampaign.status;
              });
            };

            $scope.activateCampaign = function (campaign) {
              updateCampaignStatus(campaign, "ACTIVE");
            };

            $scope.pauseCampaign = function (campaign) {
              updateCampaignStatus(campaign, "PAUSED");
            };

          }
        ]
      };
    }
  ]);
});



