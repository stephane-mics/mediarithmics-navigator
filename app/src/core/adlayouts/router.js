define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // List ad layouts
        .state('ad-layouts/list', {
          url: '/{organisation_id}/library/adLayouts',
          templateUrl: 'src/core/adlayouts/view.all.html',
          data: {
            category: 'library',
            sidebar: {
              templateUrl: 'src/core/library/library-sidebar.html',
              selected: 'ad_layouts'
            }
          }
        });
        // Create ad layout
        //.state('ad-layouts/edit', {
        //  url: '/{organisation_id}/library/adLayouts/:id',
        //  templateUrl: 'src/core/adlayouts/edit.one.html',
        //  data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        //});
    }
  ]);
});

