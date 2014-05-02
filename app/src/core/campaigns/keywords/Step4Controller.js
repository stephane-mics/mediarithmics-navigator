(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step4Controller', [
    "$scope", "$window",
    function ($scope, $window) {

      $scope.previous = function () {
        $scope.container.step = "step3";
      };

      $scope.editBudget = $scope.editLocation = function() {
        $scope.container.step = "step1";
      };

      $scope.editKeywordsList = function () {
        $scope.container.step = "step2";
      };

      $scope.editPlacement = function () {
        $scope.container.step = "step3";
      };

      $scope.next = function () {
        $window.alert("DONE");
      };
    }
  ]);
})();


