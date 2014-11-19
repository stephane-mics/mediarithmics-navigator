define(['./module'], function (module) {

  'use strict';

  module.controller('core/bidOptimizer/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', 'core/configuration', 'ngTableParams', '$window', 'core/common/auth/AuthenticationService', "core/common/WaitingService",
    function($scope, $log, Restangular, Session, _, $stateParams, $location, configuration, NgTableParams, $window, AuthenticationService, waitingService) {

      var bidOptimizerId = $stateParams.id;
      var type = $stateParams.type;

      Restangular.one('bid_optimizers', bidOptimizerId).get().then(function (bidOptimizer) {
        $scope.bidOptimizer = bidOptimizer;
      });

      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/bidOptimizers");
      };

      $scope.next = function () {
        var promise = $scope.bidOptimizer.put();
        promise.then(function success(campaignContainer){
          $log.info("success");
          $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/bidOptimizers");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
});

