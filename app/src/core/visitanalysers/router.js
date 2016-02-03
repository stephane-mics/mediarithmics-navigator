define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // List attribution models
        .state('visitanalysers/list', {
          url:'/{organisation_id}/library/visitanalysers',
          templateUrl: 'src/core/visitanalysers/view.all.html',
          data: {
            category: 'library',
            sidebar: {
              templateUrl : 'src/core/library/library-sidebar.html',
              selected: 'visit_analysers'
            }
          }
        })
        // Create a attribution model
        .state('visitanalysers/edit', {
          url:'/{organisation_id}/library/visitanalysers/:id',
          templateUrl: 'src/core/visitanalysers/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        });
    }
  ]);
});

