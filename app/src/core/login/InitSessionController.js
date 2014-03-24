(function () {
  'use strict';

  var module = angular.module('core/login');

  module.controller('core/login/InitSessionController', [
    '$location', '$log', 'core/common/auth/Session', 'core/common/auth/AuthenticationService',
    function($location, $log, Session, AuthenticationService) {

      $log.debug("InitSessionController called !");

      Session.init().then(function() {

        var path = AuthenticationService.popPendingPath();
        $log.debug("redirect to :", path);
        // success : redirect to the pending path
        $location.path(path);

      },function() {

        // failure : go back to login page
        $location.path('/login');

      });

    }
  ]);

})();

