define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('/settings/datamarts/viewAll', {
          url: '/{organisation_id}/settings/datamarts',
          templateUrl: 'src/core/settings/datamarts/view.all.html',
          data: {
            sidebar: {
              templateUrl: 'src/core/settings/settings-sidebar.html',
              selected: 'datamarts'
            }
          }
        })
        .state('/settings/datamarts/edit', {
          url: '/{organisation_id}/settings/datamarts/edit/:datamartId',
          templateUrl: 'src/core/settings/datamarts/edit.one.html',
          data: {
            sidebar: {
              templateUrl: 'src/core/settings/settings-sidebar.html',
              selected: 'datamarts'
            }
          }
        })
        .state('/settings/datamarts/new', {
          url: '/{organisation_id}/settings/datamarts/new',
          templateUrl: 'src/core/settings/datamarts/edit.one.html',
          data: {
            sidebar: {
              templateUrl: 'src/core/settings/settings-sidebar.html',
              selected: 'datamarts'
            }
          }
        });
    }
  ]);
});
