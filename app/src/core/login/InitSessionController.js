define(['./module'], function () {
  'use strict';

  var module = angular.module('core/login');

  module.controller('core/login/InitSessionController', [
    '$location', '$log', '$rootScope', 'core/common/auth/Session', 'core/common/auth/AuthenticationService', 'core/login/constants','$stateParams',
    function($location, $log, $rootScope, Session, AuthenticationService, LoginConstants, $stateParams) {

      $log.debug("InitSessionController called !");

      Session.init($stateParams.organisationId).then(function() {
        $rootScope.$broadcast(LoginConstants.LOGIN_SUCCESS);
        var path = AuthenticationService.popPendingPath();
        $log.debug("redirect to :", path);
        // success : redirect to the pending path
        $location.path(path);

      },function() {
        $rootScope.$broadcast(LoginConstants.LOGIN_FAILURE);

        // failure : go back to login page
        $location.path('login');

      });

    }
  ]);

});

