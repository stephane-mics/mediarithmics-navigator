define(['./module'], function () {

  'use strict';

  var module = angular.module('core/campaigns/emails');

  module.controller('core/campaigns/emails/MainController', [
    "$scope", 'core/campaigns/EmailCampaignService', '$stateParams', 'core/campaigns/CampaignPluginService', 'lodash', 'Restangular', '$location', '$log',
    function ($scope, EmailCampaignService, $stateParams, CampaignPluginService, _, Restangular, $location, $log) {
      var campaignId = $stateParams.campaign_id;

      function initView () {
        $scope.campaign = EmailCampaignService.getCampaignValue();
        $scope.isCreationMode = EmailCampaignService.isCreationMode();
        $scope.userGroupOpeningFeed = EmailCampaignService.getCampaign().userGroupOpeningFeed;
        $scope.userGroupClickFeed = EmailCampaignService.getCampaign().userGroupClickFeed;
      }

      CampaignPluginService.getCampaignTemplate("com.mediarithmics.campaign.email", "expert-template").then(function (template) {
        if (!campaignId || EmailCampaignService.isTemporaryId(campaignId)) {
          EmailCampaignService.initCreateCampaign(template).then(initView);
        } else {
          EmailCampaignService // TODO
          .initEditCampaign(campaignId, template)
          .then(initView);
        }
      });

      $scope.cancel = function () {
        $location.path("/");
      };

      $scope.next = function () {
        EmailCampaignService.save()
        .then(function success(campaignContainer){
          $log.info("success");
          $location.path("/campaigns/");
          EmailCampaignService.reset();
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
});



