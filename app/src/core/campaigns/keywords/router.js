define(['./module'], function () {

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('campaigns/display/keywords/edit', {
          url: '/campaigns/display/keywords/:campaign_id',
          templateUrl: 'src/core/campaigns/keywords/index.html',
          topbar : false
        });
      $stateProvider
        .state('campaigns/display/keywords/create', {
          url: '/campaigns/display/keywords',
          templateUrl: 'src/core/campaigns/keywords/index.html',
          topbar : false
        });
    }
  ]);

});

