define(['./module.js'], function () {
  'use strict';

  /* Services */
  var module = angular.module('core/creatives');


  module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider

        // list creatives 
        .when('/creatives', {
          templateUrl: 'src/core/creatives/list.html'
        })

        // create a new creative
        .when('/creatives/select-creative-template', {
          templateUrl: 'src/core/creatives/create.html',
          topbar : false
        })

        // Display Ads Templates
        // expert template
        .when('/creatives/display-ads/standard-banner/edit/:creative_id', {
          templateUrl:'src/core/creatives/display-ads/standard-banner/edit-display-ad.html',
          topbar : false
        });

    }
  ]);


});

