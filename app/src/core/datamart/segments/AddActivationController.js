define(['./module'], function (module) {
  'use strict';

  module.controller('core/datamart/segments/AddActivationController', [
    '$scope', '$uibModalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $uibModalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $scope.done = function() {

        $scope.$emit("mics-audience-segment:activation-added", {
          activation : $scope.activation
        });

        // var segment;
        // for (var i = 0; i < $scope.selectedSegments.length; i++) {
        //   segment = $scope.selectedSegments[i];
        //   $scope.$emit("mics-audience-segment:selected", {
        //     audience_segment : segment,
        //     exclude : segment.exclude // TODO use a wrapper ?
        //   });
        // }
        $uibModalInstance.close();
      };

      $scope.cancel = function() {
        $uibModalInstance.close();
      };

    }
  ]);
});
