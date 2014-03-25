(function(){
  'use strict';

  /* Services */
  var module = angular.module('core/layout');

  /* define the Authentication service */
  module.controller('core/layout/HeaderController', [
    '$scope', 'core/common/auth/Session', 'core/login/constants',
    function($scope, Session, LoginConstants) {

      function isLoggued() {
        $scope.isLoggued = Session.isInitialized();
      }
      isLoggued();

      $scope.$on(LoginConstants.LOGIN_SUCCESS, isLoggued);
      $scope.$on(LoginConstants.LOGIN_FAILURE, isLoggued);
      $scope.$on(LoginConstants.LOGOUT, isLoggued);
    }
  ]);
})();


