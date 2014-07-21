define(['./module'], function () {
  'use strict';

  /* Services */
  var module = angular.module('core/creatives/display-ads/standard-banner');


  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        // Display Ads Templates
        // expert template
        .state('creatives/display-ads/standard-banner/edit', {
          url:'/{organisation_id}/creatives/display-ads/standard-banner/edit/:creative_id',
          templateUrl: 'src/core/creatives/display-ads/standard-banner/edit-display-ad.html',
          topbar: false
        });

    }
  ]);


});

