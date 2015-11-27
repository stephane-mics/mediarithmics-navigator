define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // List attribution models
        .state('attributionmodels/list', {
          url:'/{organisation_id}/library/attributionmodels',
          templateUrl: 'src/core/attributionmodels/view.all.html',
          data: {
            category: 'library',
            sidebar: {
              templateUrl : 'src/core/library/library-sidebar.html',
              selected: 'attribution_models'
            }
          }
        })
        // Create a attribution model
        .state('attributionmodels/edit', {
          url:'/{organisation_id}/library/attributionmodels/:id',
          templateUrl: 'src/core/attributionmodels/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        });
    }
  ]);
});

