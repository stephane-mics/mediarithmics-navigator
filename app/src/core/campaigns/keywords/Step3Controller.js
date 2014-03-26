(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step3Controller', [
    "$scope",
    function ($scope) {

      $scope.previous = function () {
        $scope.container.step = "step2";
      };

      $scope.next = function () {
        $scope.container.step = "step4";
      };
    }
  ]);
})();


