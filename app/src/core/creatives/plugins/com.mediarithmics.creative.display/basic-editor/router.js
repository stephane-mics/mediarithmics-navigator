define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // create
        .state('creatives/com_mediarithmics_creative_display/basic-editor/create', {
          url:'/{organisation_id}/creatives/com.mediarithmics.creative.display/basic-editor/create',
          templateUrl: 'src/core/creatives/plugins/com.mediarithmics.creative.display/basic-editor/create.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        })
        // edit
        .state('creatives/com_mediarithmics_creative_display/basic-editor/edit', {
          url:'/{organisation_id}/creatives/com.mediarithmics.creative.display/basic-editor/edit/:creative_id',
          templateUrl: 'src/core/creatives/plugins/com.mediarithmics.creative.display/basic-editor/edit.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        });
    }
  ]);


});

