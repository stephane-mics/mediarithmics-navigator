(function () {
  'use strict';

  var module = angular.module('core/login');

  module.controller('core/login/MainController', [
    '$scope', '$location', '$log', 'core/common/auth/AuthenticationService', 'core/common/auth/Session',
    function($scope, $location, $log, AuthenticationService, Session) {

      $scope.submit = function() {

        // check that email & password are not empty
        if  ( !$scope.user.email || !$scope.user.password ) {

        }

        if ($scope.rememberMe) {

          AuthenticationService.createRefreshToken($scope.user.email, $scope.user.password).then(function() {

            // success : create an access token
            AuthenticationService.createAccessToken().then(function() {

              Session.init().then(function() {
                // success : redirect to the pending path
                $location.path(AuthenticationService.popPendingPath());

              },function() {
                // failure : display an error message
                $scope.message = "Authentication error";
              });


            }, function() {
              // failure : display an error message
              $scope.message = "Authentication error";
            });
          },

          function() {
            // failure : display an error message
            $scope.message = "Authentication error";
          }

                                                                                                );

        } else {

          // authentication without creation of refresh token
          AuthenticationService.createAccessToken($scope.user.email, $scope.user.password).then(function(){

            Session.init().then(function() {
              var newPath = AuthenticationService.popPendingPath();
              $log.debug("redirect to : "+newPath);
              // success : redirect to the pending path
              $location.path(AuthenticationService.popPendingPath());

            },function() {
              // failure : display an error message
              $scope.message = "Authentication error";
            });

          }, function() {
            // failure : redirect to the login page
            $scope.message = "Authentication error";
          });

        }
      };
    }
  ]);
})();

