define(['./module'], function () {
    'use strict';

    /* Services */
    var module = angular.module('core/layout');

    /* define the Authentication service */
    module.controller('core/layout/HeaderController', [
      '$scope', 'core/common/auth/Session', 'core/login/constants', '$location',
      function ($scope, Session, LoginConstants, $location) {

        function isLoggued() {
          $scope.isLoggued = Session.isInitialized();
          if ($scope.isLoggued) {
            $scope.firstName = Session.getUserProfile().first_name;
            $scope.lastName = Session.getUserProfile().last_name;          
          }
        }

        isLoggued();

        $scope.switchWorkspace = function (idx) {
          Session.switchWorkspace(idx);

        };

        function updateWorkspaces() {
          $scope.workspaces = Session.getWorkspaces();
          $scope.organisationId = Session.getCurrentWorkspace().organisation_id;

        }


        $scope.$on(LoginConstants.LOGIN_SUCCESS, isLoggued);
        $scope.$on(LoginConstants.WORKSPACE_CHANGED, updateWorkspaces);
        $scope.$on(LoginConstants.LOGIN_SUCCESS, updateWorkspaces);
        $scope.$on(LoginConstants.LOGIN_FAILURE, isLoggued);
        $scope.$on(LoginConstants.LOGOUT, isLoggued);
      }
    ]);
});


