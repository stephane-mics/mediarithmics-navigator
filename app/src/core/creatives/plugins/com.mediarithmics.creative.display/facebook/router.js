define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // create
        .state('creatives/com_mediarithmics_creative_display/facebook/create', {
          url:'/{organisation_id}/creatives/com.mediarithmics.creative.display/facebook/create',
          templateUrl: 'src/core/creatives/plugins/com.mediarithmics.creative.display/facebook/create.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        })
    }
  ]);


});

