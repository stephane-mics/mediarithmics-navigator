define(['./module'], function () {
  'use strict';

  /*
   * Change Password Controller
   *   
   * controls the popin window
   */

  var module = angular.module('core/usersettings');

  module.controller('core/usersettings/ChangePasswordController', [
    '$scope', '$modalInstance', '$log', 'Restangular', 'lodash', 'core/common/auth/Session', 'core/common/auth/AuthenticationService',
    function($scope, $modalInstance, $log, Restangular, _, Session, AuthenticationService) {

      $scope.errors = [];
      $scope.oldPassword = "";
      $scope.newPassword = "";
      $scope.confirmedPassword = "";

      $scope.submit = function() {

        $scope.errors = [];

        // check if the input fields are valid
        if ( (typeof($scope.oldPassword) == "undefined") || ($scope.oldPassword.length == 0)) {
          $scope.errors.push("old password must not be empty");
         
        }
        if ( (typeof($scope.newPassword) == "undefined") || ($scope.newPassword.length == 0)) {
          $scope.errors.push("new password must not be empty");
        
        }
        if ( (typeof($scope.newPassword) == "undefined") || ($scope.confirmedPassword != $scope.newPassord)) {
          $scope.errors.push("confirmed password must be the same");
        
        }

        $log.debug("old password", $scope.oldPassword);
        $log.debug("errors : ", $scope.errors);
        if ($scope.errors.length > 0) return;
        
        var promise = Restangular.all("users/" +$scope.userId + "/change_passwords").post({
          old_password : $scope.oldPassword,
          new_password : $scope.newPassword,
          confirmed_password : $scope.confirmedPassword
        })        
        .then(function success(data) {

          
        },function failure() {
          
          
        });

        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };


    }
  ]);

});

