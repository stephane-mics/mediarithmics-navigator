define(['./module'], function (module) {
  'use strict';

  module.controller('core/campaigns/emails/ChooseExistingEmailTemplatesController', [
    '$scope', '$uibModalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', 'Restangular', 'core/common/auth/Session', 'core/common/ads/AdService',
    function($scope, $uibModalInstance, $document, $log, DisplayCampaignService, Restangular, Session, AdService) {
      $scope.currentPage = 1;
      $scope.itemsPerPage = 10;

      $scope.emailTemplates = Restangular.all("creatives").getList({
        max_results : 200,
        creative_type : 'EMAIL_TEMPLATE',
        archived : false,
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedTemplates = [];

      $scope.done = function () {
        var template;
        for (var i = 0; i < $scope.selectedTemplates.length; i++) {
          template = $scope.selectedTemplates[i];
          $scope.$emit("mics-email-template:selected", {
            template: template
          });
        }
        $uibModalInstance.close();
      };

      $scope.cancel = function () {
        $uibModalInstance.close();
      };

    }
  ]);
});
