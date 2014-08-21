define(['./module'], function (module) {
  'use strict';

  module.controller('core/creatives/DeleteController', [
    '$scope', '$modalInstance', '$location','core/common/auth/Session','$state', '$stateParams', "core/common/ErrorService",
    function($scope, $modalInstance, $location, Session, $state, $stateParams, errorService) {

      $scope.done = function() {
        $scope.creative.remove().then(function (){
          $modalInstance.close();
          $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/creatives");
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



