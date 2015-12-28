define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // list creatives
        .state('creatives', {
          url: '/{organisation_id}/creatives',
          templateUrl: 'src/core/creatives/list.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/creatives/creatives-sidebar.html',
              selected: 'all_creatives'
            }
          }
        });
    }
  ]);
});

