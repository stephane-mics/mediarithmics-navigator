'use strict';


var loginControllers = angular.module('loginControllers', ['sessionServices', 'restangular']);


loginControllers.controller('LoginController', [
  '$scope', '$location', 'AuthenticationService', 'Session',
  function($scope, $location, AuthenticationService, Session) {

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
            console.debug("redirect to : "+newPath);
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

loginControllers.controller('RememberMeController', [
  '$location', 'AuthenticationService',
  function($location, AuthenticationService) {

    console.debug("RememberMeController called !");

    AuthenticationService.createAccessToken().then(function(){
      // success  redirect to the pending path
      $location.path(AuthenticationService.popPendingPath());

    }, function() {
      // failure : redirect to the login page
      $location.path('/login');
    });
  }
]);


loginControllers.controller('InitSessionController', [
  '$location', 'Session', 'AuthenticationService',
  function($location, Session, AuthenticationService) {

    console.debug("InitSessionController called !");

    Session.init().then(function() {

      var path = AuthenticationService.popPendingPath();
      console.debug("redirect to :", path);
      // success : redirect to the pending path
      $location.path(path);

    },function() {

      // failure : go back to login page
      $location.path('/login');

    });

  }
]);
