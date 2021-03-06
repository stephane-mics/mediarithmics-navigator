define(['./module'], function (module) {
  'use strict';

  module.controller('core/bidOptimizer/ChooseExistingBidOptimizerController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $scope.availableBidOptimizers = Restangular.all("bid_optimizers").getList({
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedBidOptimizer = {
        id : null
      };

      $scope.done = function() {
        var bidOptimizer;
        for (var i = 0; i < $scope.availableBidOptimizers.length; i++) {
          bidOptimizer = $scope.availableBidOptimizers[i];
          if(bidOptimizer.id === $scope.selectedBidOptimizer.id) {
            $scope.$emit("mics-bid-optimizer:selected", {
              bidOptimizer : bidOptimizer
            });
          }
        }
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});


