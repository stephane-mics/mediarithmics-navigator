(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords', [
    'core/campaigns',
    'restangular'
  ]);

  module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
      .when('/display-campaigns/campaign/keywords', {
        templateUrl: 'src/core/campaigns/keywords/index.html'
      });
    }
  ]);

})();

