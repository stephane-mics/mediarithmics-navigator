define(['./module'], function () {

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('campaigns/display/keywords/edit', {
          url:'/{organisation_id}/campaigns/display/keywords/:campaign_id',
          templateUrl: 'src/core/campaigns/keywords/index.html'
        });
      $stateProvider
        .state('campaigns/display/keywords/create', {
          url:'/{organisation_id}/campaigns/display/keywords',
          templateUrl: 'src/core/campaigns/keywords/index.html'
        });
    }
  ]);

});

