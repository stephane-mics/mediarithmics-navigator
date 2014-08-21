define(['./module'], function () {
  'use strict';

  var module = angular.module('core/placementlists');

  module.controller('core/placementlists/DeleteController', [
    '$scope', '$modalInstance', '$location', '$state', '$stateParams', "core/common/ErrorService",
    function($scope, $modalInstance, $location, $state, $stateParams, errorService) {

      $scope.done = function() {
        $scope.placementList.remove().then(function (){
          $modalInstance.close();
          $location.path("/library/placementlists");

          // $state.reload();
          // see https://github.com/angular-ui/ui-router/issues/582
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        }, function failure(response) {
          $modalInstance.close();
          errorService.showErrorModal({
            error: response,
            messageType:"simple"
          });
        });
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});



