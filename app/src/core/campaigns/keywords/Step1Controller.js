(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step1Controller', [
    "$scope",
    function ($scope) {

      $scope.next = function () {
        $scope.container.step = "step2";
      };
    }
  ]);
})();


