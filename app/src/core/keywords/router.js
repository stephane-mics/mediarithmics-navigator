(function(){

  'use strict';

  var module = angular.module('core/keywords');

   module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
      .when('/library/keywordslists', {
        templateUrl: 'src/core/keywords/view.all.html'
      })
      .when('/library/keywordslists/new', {
        templateUrl: 'src/core/keywords/edit.one.html',
        topbar : false
      })
      .when('/library/keywordslists/:keywordslist_id?', {
        templateUrl: 'src/core/keywords/edit.one.html',
        topbar : false
      });
    }
  ]);

})();
