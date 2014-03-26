(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/MainController', [
    "$scope", 'core/campaigns/CampaignContainer',
    function ($scope, CampaignContainer) {
      $scope.campaign = new CampaignContainer();
      $scope.container = {
        step : "step1"
      };
    }
  ]);
})();


