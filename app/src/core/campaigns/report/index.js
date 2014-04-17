(function(){

  'use strict';

  var module = angular.module('core/campaigns/report', [
    'restangular',
    'ngResource',
    // TODO : circular deps ?
    'core/campaigns',
    'core/adgroups',
    'ui.bootstrap'
  ]);


  module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
      .when('/display-campaigns/report/:campaign_id/:template', {
        templateUrl:'src/core/campaigns/report/show-report.html'
      });
    }
  ]);



})();
