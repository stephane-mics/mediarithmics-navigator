(function(){

  'use strict';

  var module = angular.module('core/campaigns/report');


  module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
        .when('/campaigns/display/report/:campaign_id/:template', {
          templateUrl:'src/core/campaigns/report/show-report.html'
        });
    }
  ]);



})();
