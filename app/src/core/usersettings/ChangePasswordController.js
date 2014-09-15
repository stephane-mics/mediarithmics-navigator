define(['./module'], function () {
  'use strict';

  /*
   * Change Password Controller
   *   
   * controls the popin window
   */

  var module = angular.module('core/usersettings');

  module.controller('core/usersettings/ChangePasswordController', [
    '$scope', '$modalInstance', '$log', 'lodash', 'core/common/auth/Session', 'core/common/auth/AuthenticationService',
    function($scope, $modalInstance, $log, _, Session, AuthenticationService) {


      $scope.submit = function() {

        // check if the input fields are valid
        if ($scope.oldPassword.length == 0) {
          $scope.errors.push("old password must not be empty");
          return;
        }
        if ($scope.newPassword.length == 0) {
          $scope.errors.push("new password must not be empty");
          return;
        }
        if ($scope.confirmPassword == $scope.newPassord) {
          $scope.errors.push("confirmed password must be the same");
          return;
        }
        
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };


    }
  ]);

});

