define(['./module'], function (module) {
  'use strict';

  module.controller('core/login/InitSessionController', [
    '$location', '$log', '$rootScope', 'core/common/auth/Session', 'core/common/auth/AuthenticationService', 'core/login/constants', '$stateParams',
    function ($location, $log, $rootScope, Session, AuthenticationService, LoginConstants, $stateParams) {
      Session.init($stateParams.organisationId).then(function () {
        $rootScope.$broadcast(LoginConstants.LOGIN_SUCCESS);
        var path = AuthenticationService.popPendingPath();
        $log.debug("Redirecting to :", path);
        // Success: Redirect to the pending path
        $location.path(path);
      }, function () {
        $rootScope.$broadcast(LoginConstants.LOGIN_FAILURE);
        // Failure: Go back to login page
        $location.path('login');
      });
    }
  ]);
});

