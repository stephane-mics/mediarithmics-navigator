define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // list creatives
        .state('bid-optimizers/list', {
          url:'/{organisation_id}/library/bidOptimizers',
          templateUrl: 'src/core/bidOptimizer/view.all.html'
        })
        // create a new creative
        .state('bid-optimizer/edit', {
          url:'/{organisation_id}/library/bidOptimizers/:id',
          templateUrl: 'src/core/bidOptimizer/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        });
    }
  ]);
});

