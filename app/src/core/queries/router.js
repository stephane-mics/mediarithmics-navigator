define(['./module'], function (module) {

  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
          .state('library/queries/edit', {
              url:'/{organisation_id}/library/queries/{query_id}',
              templateUrl: 'src/core/queries/edit.one.html',
              data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
          }).state('library/queries', {
              url:'/{organisation_id}/library/queries',
              templateUrl: 'src/core/queries/view.all.html'
          });

    }
  ]);

});
