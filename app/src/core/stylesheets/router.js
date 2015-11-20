define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('stylesheets/list', {
          url: '/{organisation_id}/library/stylesheets',
          templateUrl: 'src/core/stylesheets/view.all.html',
          data: {
            category: 'library',
            sidebar: {
              templateUrl: 'src/core/library/library-sidebar.html',
              selected: 'style_sheets'
            }
          }
        })
        .state('stylesheets/newStyleSheet', {
          url: '/{organisation_id}/library/stylesheets/new',
          templateUrl: 'src/core/stylesheets/create.one.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        })
        .state('stylesheets/newVersion', {
          url: '/{organisation_id}/library/stylesheets/:style_sheet_id/new-version',
          templateUrl: 'src/core/stylesheets/edit.one.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        })
        .state('stylesheets/duplicateVersion', {
          url: '/{organisation_id}/library/stylesheets/:style_sheet_id/new-version/:version_id',
          templateUrl: 'src/core/stylesheets/edit.one.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        })
        .state('stylesheets/editVersion', {
          url: '/{organisation_id}/library/stylesheets/:style_sheet_id/version/:version_id',
          templateUrl: 'src/core/stylesheets/edit.one.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        });
    }
  ]);
});

