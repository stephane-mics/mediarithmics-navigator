(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step2Controller', [
    "$scope",
    function ($scope) {

      if (!$scope.campaign.keywordsLists.length) {
        $scope.campaign.keywordsLists.push({expressionList:[]});
      }
      $scope.keywordsList = $scope.campaign.keywordsLists[0];

      $scope.previous = function () {
        $scope.container.step = "step1";
      };

      $scope.next = function () {
        $scope.container.step = "step3";
      };
    }
  ]);
})();


