define(['./module'], function () {

  'use strict';

  var module = angular.module('core/campaigns/report');


  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('campaigns/display/report', {
          url:'/{organisation_id}/campaigns/display/report/:campaign_id/:template',
          templateUrl:'src/core/campaigns/report/show-report.html'
        });
    }
  ]);



});
