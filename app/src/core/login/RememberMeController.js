(function () {
  'use strict';

  var module = angular.module('core/login');

  module.controller('core/login/RememberMeController', [
    '$location', '$log', 'core/common/auth/AuthenticationService',
    function($location, $log, AuthenticationService) {

      $log.debug("RememberMeController called !");

      AuthenticationService.createAccessToken().thendefine(['./module.js'], function () {
        // success  redirect to the pending path
        $location.path(AuthenticationService.popPendingPath());

      }, function() {
        // failure : redirect to the login page
        $location.path('/login');
      });
    }
  ]);

});

