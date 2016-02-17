define(['./module'], function (module) {

  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
      .state('library/exports', {
        url:'/{organisation_id}/library/exports',
        templateUrl: 'src/core/exports/view.all.html',
        data: {
          sidebar: {
            templateUrl: 'src/core/library/library-sidebar.html',
            selected: 'exports'
          }
        }
      })
      .state('library/exports/id', {
        url:'/{organisation_id}/library/exports/:exportId',
        templateUrl: 'src/core/exports/view.one.html',
        data: {
          sidebar: {
            templateUrl: 'src/core/library/library-sidebar.html',
            selected: 'exports'
          }
        }
      })
      .state('library/exports/id/edit', {
        url:'/{organisation_id}/library/exports/:exportId/edit',
        templateUrl: 'src/core/exports/edit.one.html',
        data: {
          navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'
        }
      });
    }
  ]);
});
