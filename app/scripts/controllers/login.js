'use strict';


var loginControllers = angular.module('loginControllers', ['directoryServices', 'restangular']);


loginControllers.controller('LoginController', ['$scope', '$location', 'AuthenticationService',
	function($scope, $location, AuthenticationService) {

		$scope.submit = function() {

			// check that email & password are not empty
			if  ( (typeof($scope.user.email) == "undefined") || ((typeof($scope.user.password) == "undefined")) ) {

			}

			if ($scope.rememberMe) {

				AuthenticationService.createRefreshToken($scope.user.email, $scope.user.password).then(function() {
								
					// success : create an access token																
					AuthenticationService.createAccessToken().then(function() {

						// success : redirect to the pending path
						$location.path(AuthenticationService.popPendingPath());

					}, function() {
						// failure : display an error message
						$scope.message = "Authentication error"
					})},

					function() {
						// failure : display an error message
						$scope.message = "Authentication error"	
					}

				);

			} else {				

				// authentication without creation of refresh token
				AuthenticationService.createAccessToken($scope.user.email, $scope.user.password).then(function(){

					var newPath = AuthenticationService.popPendingPath();
					console.debug("redirect to : "+newPath)

					// success  redirect to the pending path
					$location.path(newPath);

					}, function() {
						// failure : redirect to the login page
						$scope.message = "Authentication error"		
					});
				
			}
		}		
}]);

loginControllers.controller('RememberMeController', ['$location', 'AuthenticationService', 

	function($location, AuthenticationService) {

		console.debug("RememberMeController called !");

		AuthenticationService.createAccessToken().then(function(){
			// success  redirect to the pending path
				$location.path(AuthenticationService.popPendingPath());

			}, function() {
				// failure : redirect to the login page
				$location.paht('/login');
			});		
}]);