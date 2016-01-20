define(['./module'], function (module) {
  'use strict';

  module.controller('core/datamart/segments/AddActivationController', [
    '$scope', '$uibModalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $uibModalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $scope.done = function() {
        $scope.$emit("mics-audience-segment:activation-added", $scope.activation);        
        $uibModalInstance.close();
      };

      $scope.cancel = function() {
        $uibModalInstance.close();
      };

    }
  ]);
});
