define(['./module'], function (module) {

  'use strict';

  module.controller('core/bidOptimizer/CreateController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', '$modalInstance',
    function($scope, $log, Restangular, Session, _, $stateParams, $location, $modalInstance) {
      $scope.availableBidOptimizers = Restangular.all("bid_optimizers").getList({
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedBidOptimizerEngine = null;
      $scope.bidOptimizer = {
        name : "",
        bidOptimizerEngine : null
      };

      $scope.bidOptimizerIsOk = function () {
        return !!($scope.bidOptimizer.name && $scope.bidOptimizer.bidOptimizerEngine);
      };

      $scope.availableBidOptimizerEngines = Restangular.all("plugins").getList({
        plugin_type : "BID_OPTIMIZATION_ENGINE",
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;


      $scope.cancel = function() {
        $modalInstance.close();
      };

      $scope.done = function() {

        var promise = Restangular.all('bid_optimizers').post({
          name : $scope.bidOptimizer.name,
          engine_group_id : $scope.bidOptimizer.bidOptimizerEngine.split('/')[0],
          engine_artifact_id : $scope.bidOptimizer.bidOptimizerEngine.split('/')[1]
        }, {
          organisation_id: Session.getCurrentWorkspace().organisation_id
        });

        promise.then(function success(createdBidOptimizer){
          $scope.$emit("mics-bid-optimizer:selected", {
            bidOptimizer : createdBidOptimizer
          });
          $modalInstance.close();
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
});
