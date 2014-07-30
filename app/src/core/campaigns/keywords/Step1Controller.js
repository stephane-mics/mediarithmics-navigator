define(['./module'], function () {

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step1Controller', [
    "$scope", "$location",
    function ($scope, $location) {

      $scope.cancel = function () {
        $location.path("/");
      };

      $scope.next = function () {
        $scope.container.step = "step2";
      };
    }
  ]);
});


