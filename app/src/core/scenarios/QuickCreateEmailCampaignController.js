define(['./module'], function (module) {
  'use strict';

  module.controller('core/scenarios/QuickCreateEmailCampaignController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/EmailCampaignService', "Restangular", 'core/common/auth/Session','core/campaigns/CampaignPluginService',
    function($scope, $modalInstance, $document, $log, EmailCampaignService, Restangular, Session, CampaignPluginService) {
        CampaignPluginService.getCampaignTemplate("com.mediarithmics.campaign.email", "expert-template").then(function (template) {
            EmailCampaignService.initCreateCampaign(template).then(function () {
                $scope.campaign = EmailCampaignService.getCampaignValue();
            });
        });
      $scope.type = "EMAIL";


      $scope.create = function() {
          EmailCampaignService.save().then(function (campaignContainer) {
              $scope.$emit("mics-campaign:selected", campaignContainer);
              $modalInstance.close();
          });

      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});


