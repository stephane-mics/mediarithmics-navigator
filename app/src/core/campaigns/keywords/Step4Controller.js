(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step4Controller', [
    "$scope",
    function ($scope) {

      $scope.previous = function () {
        $scope.container.step = "step3";
      };

      $scope.next = function () {
        alert("DONE");
      };
    }
  ]);
})();


