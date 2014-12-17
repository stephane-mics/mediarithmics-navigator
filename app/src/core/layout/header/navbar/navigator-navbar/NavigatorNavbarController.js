define(['./module'], function () {
  'use strict';

  var module = angular.module('core/layout/header/navbar/navigator-navbar');

  module.controller('NavigatorNavbarController', [
    '$scope', '$log', 'core/common/auth/Session', 'core/login/constants',
    function ($scope, $log, Session, LoginConstants) {
      function isLogged() {
        $scope.isLogged = Session.isInitialized();
      }

      isLogged();

      $scope.switchWorkspace = function (organisationId) {
        Session.setWorkspace(organisationId);
      };

      function updateWorkspaces() {
        $scope.workspaces = Session.getWorkspaces();
        $scope.hasDatamart = Session.hasDatamart();
        $scope.organisationId = Session.getCurrentWorkspace().organisation_id;
      }

      $scope.$on(LoginConstants.LOGIN_SUCCESS, isLogged);
      $scope.$on(LoginConstants.WORKSPACE_CHANGED, updateWorkspaces);
      $scope.$on(LoginConstants.LOGIN_SUCCESS, updateWorkspaces);
      $scope.$on(LoginConstants.LOGIN_FAILURE, isLogged);
      $scope.$on(LoginConstants.LOGOUT, isLogged);
    }
  ]);
});


