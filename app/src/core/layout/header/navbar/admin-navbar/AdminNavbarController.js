define(['./module'], function () {
	'use strict';

	var module = angular.module('core/layout/header/navbar/admin-navbar');

	module.controller('AdminNavbarController', [
		'$scope', '$log', 'core/common/auth/Session', 'core/login/constants', '$location',
		function ($scope, $log, Session, LoginConstants, $location) {
			function isLogged() {
				$scope.isLogged = Session.isInitialized();
			}

			isLogged();

			$scope.switchWorkspace = function (idx) {
				Session.switchWorkspace(idx);
			};

			function updateWorkspaces() {
				$scope.workspaces = Session.getWorkspaces();
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


