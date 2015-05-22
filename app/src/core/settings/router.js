define(['./module'], function (module) {

  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('settings', {
          url: '/settings',
          templateUrl: 'src/core/settings/settings.html'
        });
    }
  ]);

});
