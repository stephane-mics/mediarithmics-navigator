define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // List ad layouts
        .state('adlayouts/list', {
          url: '/{organisation_id}/library/adlayouts',
          templateUrl: 'src/core/adlayouts/view.all.html',
          data: {
            category: 'library',
            sidebar: {
              templateUrl: 'src/core/library/library-sidebar.html',
              selected: 'ad_layouts'
            }
          }
        })
        .state('library/adlayouts/new', {
          url: '/{organisation_id}/library/adlayouts/new',
          templateUrl: 'src/core/adlayouts/edit.one.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        })
        .state('library/adlayouts/edit', {
          url: '/{organisation_id}/library/adlayouts/:adlayout_id',
          templateUrl: 'src/core/adlayouts/edit.one.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        });
    }
  ]);
});

