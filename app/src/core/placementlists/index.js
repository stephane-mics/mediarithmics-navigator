(function(){

  'use strict';

  var module = angular.module('core/placementlists', [
    'restangular'
  ]);

   module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
      .when('/library/placementlists', {
        templateUrl: 'src/core/placementlists/view.all.html'
      })
      .when('/library/placementlists/:type/:placementlist_id?', {
        templateUrl: 'src/core/placementlists/edit.one.html',
        topbar : false
      });
    }
  ]);


})();
