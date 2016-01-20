define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('/settings/useraccount', {
          url: '/{organisation_id}/settings/useraccount',
          templateUrl: 'src/core/settings/useraccount/user-account.html',
          data: {
            sidebar: {
              templateUrl: 'src/core/settings/settings-sidebar.html',
              selected: 'user_account'
            }
          }
        });
    }
  ]);
});
