define(['./module', "autofill-event"], function (module) {
  'use strict';

  module.controller('core/password/ResetPasswordController', [
    '$scope', '$rootScope', '$location', '$stateParams', '$log', 'Restangular', 'core/common/auth/AuthenticationService', 'core/common/auth/Session', 'core/login/constants',
    function ($scope, $rootScope, $location, $stateParams, $log, Restangular, AuthenticationService, Session, LoginConstants) {
      $scope.newPassword = "";
      $scope.confirmPassword = "";
      if (!angular.isDefined($stateParams.token) || !angular.isDefined($stateParams.email)) {
        $scope.errorMessage = "Invalid url arguments.";
      }

      function initSession() {
        console.log("init session");
        Session.init().then(function () {
          $rootScope.$broadcast(LoginConstants.LOGIN_SUCCESS);
          var newPath = AuthenticationService.popPendingPath();
          $log.debug("Redirecting to : " + newPath);
          $location.path(newPath);
        }, function () {
          $rootScope.$broadcast(LoginConstants.LOGIN_FAILURE);
        });
      }

      function automaticLoginFail() {
        $scope.errorMessage = "Couldn't log in automatically.";
      }

      $scope.submit = function () {
        if ($scope.newPassword !== $scope.confirmPassword || $scope.newPassword.length === 0) {
          $scope.errorMessage = "Invalid password.";
        } else {
          Restangular.all("authentication/reset_password").post({
            email: $stateParams.email,
            token: $stateParams.token,
            password: $scope.newPassword
          }).then(function () {
            AuthenticationService.createRefreshToken($stateParams.email, $scope.newPassword).then(function () {
              AuthenticationService.createAccessToken().then(initSession, automaticLoginFail);
            }, automaticLoginFail);
          }, function () {
            $location.path('request-password-reset').search({error: 1});
          });
        }
      }
    }
  ]);
});