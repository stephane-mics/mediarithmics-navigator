define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // List assets
        .state('assets/list', {
          url: '/{organisation_id}/library/assets',
          templateUrl: 'src/core/assets/view.all.html',
          data: {
            category: 'library',
            sidebar: {
              templateUrl: 'src/core/library/library-sidebar.html',
              selected: 'assets'
            }
          }
        });
    }
  ]);
});

