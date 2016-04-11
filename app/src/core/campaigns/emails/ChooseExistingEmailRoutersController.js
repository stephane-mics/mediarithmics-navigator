define(['./module'], function (module) {
  'use strict';

  module.controller('core/campaigns/emails/ChooseExistingEmailRoutersController', [
    '$scope', '$uibModalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', 'Restangular', 'core/common/auth/Session', 'core/common/ads/AdService',
    function($scope, $uibModalInstance, $document, $log, DisplayCampaignService, Restangular, Session, AdService) {
      $scope.currentPage = 1;
      $scope.itemsPerPage = 10;

      $scope.emailRouters = Restangular.all("email_routers").getList({
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedRouters = [];

      $scope.done = function () {
        var router;
        for (var i = 0; i < $scope.selectedRouters.length; i++) {
          router = $scope.selectedRouters[i];
          $scope.$emit("mics-email-router:selected", {
            router: router
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
