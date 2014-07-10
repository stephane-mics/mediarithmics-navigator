(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
        .when('/campaigns/display/keywords/:campaign_id?', {
          templateUrl: 'src/core/campaigns/keywords/index.html',
          topbar : false
        });
    }
  ]);

})();

