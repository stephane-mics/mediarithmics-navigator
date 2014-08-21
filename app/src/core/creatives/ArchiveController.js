define(['./module'], function (module) {
  'use strict';

  module.controller('core/creatives/ArchiveController', [
    '$scope', '$modalInstance', '$location','core/common/auth/Session', '$state', '$stateParams', "core/common/ErrorService",
    function($scope, $modalInstance, $location, Session, $state, $stateParams, errorService) {

      $scope.done = function() {
        $scope.creative.archived = true;
        $scope.creative.put().then(function (){
          $modalInstance.close();
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



