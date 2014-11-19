define(['./module'], function (module) {

  'use strict';

  module.controller('core/bidOptimizer/ViewAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal', '$state', '$stateParams',
    function($scope, Restangular, Session, $location, $modal, $state, $stateParams) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.bidOptimizers = Restangular.all("bid_optimizers").getList({
        organisation_id : organisationId
      }).$object;
      $scope.organisationId = organisationId;

      $scope.createBidOptimizer = function () {
        var uploadModal = $modal.open({
          templateUrl: 'src/core/bidOptimizer/create.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/bidOptimizer/CreateController',
          size: "lg"
        });
        uploadModal.result.then(function () {
          // $state.reload();
          // see https://github.com/angular-ui/ui-router/issues/582
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
      };
    }
  ]);

});


