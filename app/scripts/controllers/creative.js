'use strict';

/*
 * Creative Controllers Module
 * 
 * this module provides controllers needed to manage campaigns
 * - creative list
 * - creative editor
 *  
 */

 var creativeControllers = angular.module('CreativeControllers', []);

 /*
  * Creative list controller
  */

  creativeControllers.controller('CreativeListCtrl', ['$scope',
  	function($scope) {
  		$scope.hello = 'Creative List';
  	}]);
