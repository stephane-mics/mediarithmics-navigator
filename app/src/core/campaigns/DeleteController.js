define(['./module'], function (module) {
  'use strict';

  module.controller('core/campaigns/DeleteController', [
    '$scope', '$modalInstance', '$location', "core/common/ErrorService",
    function ($scope, $modalInstance, $location, errorService) {

      $scope.done = function () {
        $scope.campaign.remove().then(function () {
          $modalInstance.close();
          $location.path("/");
        }, function failure(response) {
          $modalInstance.close();
          errorService.showErrorModal({
            error: response,
            messageType: "simple"
          });
        });
      };

      $scope.cancel = function () {
        $modalInstance.close();
      };
    }
  ]);
});



