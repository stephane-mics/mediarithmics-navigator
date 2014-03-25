(function () {
  'use strict';

  var module = angular.module('core/login');

  module.controller('core/login/LogoutController', [
    '$location', '$log', '$rootScope', 'core/common/auth/AuthenticationService', 'core/common/auth/Session', 'core/login/constants',
    function($location, $log, $rootScope, AuthenticationService, Session, LoginConstants) {

      AuthenticationService.logout();
      Session.logout();
      $rootScope.$broadcast(LoginConstants.LOGOUT);
      $location.path('/login');

    }
  ]);
})();

