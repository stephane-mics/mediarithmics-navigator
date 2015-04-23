define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('campaigns/display/keywords/edit', {
          url: '/{organisation_id}/campaigns/display/keywords/:campaign_id',
          templateUrl: 'src/core/campaigns/keywords/index.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        });
      $stateProvider
        .state('campaigns/display/keywords/create', {
          url: '/{organisation_id}/campaigns/display/keywords',
          templateUrl: 'src/core/campaigns/keywords/index.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        });
    }
  ]);

});

