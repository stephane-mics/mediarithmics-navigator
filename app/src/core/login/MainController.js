(function () {
  'use strict';

  var module = angular.module('core/login');

  module.controller('core/login/MainController', [
    '$scope', '$location', '$log', '$rootScope', 'jquery', 'core/common/auth/AuthenticationService', 'core/common/auth/Session', 'core/login/constants',
    function($scope, $location, $log, $rootScope, $, AuthenticationService, Session, LoginConstants) {
      $scope.user = {email:"", password:""};
      setTimeout(function() {
        $("#loginEmail").checkAndTriggerAutoFillEvent();
      } ,0);
      function showSimpleError() {
        $scope.authError = true;
        // failure : display an error message
        $scope.message = "Authentication error";
      }

      function initSession () {
        $scope.authError = false;
        Session.init().then(function() {
          $rootScope.$broadcast(LoginConstants.LOGIN_SUCCESS);
          var newPath = AuthenticationService.popPendingPath();
          $log.debug("redirect to : "+newPath);
          // success : redirect to the pending path
          $location.path(newPath);

        }, function () {
          $rootScope.$broadcast(LoginConstants.LOGIN_FAILURE);
          showSimpleError();
        });
      }

      $scope.submit = function() {
        
        // check that email & password are not empty
        if  ( !$scope.user.email || !$scope.user.password ) {
          
        }

        if ($scope.rememberMe) {

          AuthenticationService.createRefreshToken($scope.user.email, $scope.user.password).then(function() {

            // success : create an access token
            AuthenticationService.createAccessToken().then(initSession, showSimpleError);
          }, showSimpleError);

        } else {

          // authentication without creation of refresh token
          AuthenticationService.createAccessToken($scope.user.email, $scope.user.password).then(function(){

            Session.init().then(initSession, showSimpleError);
          }, showSimpleError);
        }
      };
    }
  ]);
})();

