(function(){
  'use strict';

  /* Services */
  var module = angular.module('core/creatives',[
  	'restangular'
  	]);


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
          templateUrl:'src/core/creatives/create.html',
          topbar : false
        })      

        // Display Ads Templates
        // expert template
        .when('/creatives/display-ads/expert/edit/:creative_id', {
          templateUrl:'src/core/displays/expert/edit-campaign.html',
          topbar : false
        });

    }
  ]);


})();

