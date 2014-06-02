(function(){

  'use strict';

  var module = angular.module('core/usergroups', [
    'restangular',
    'checklist-model'
  ]);

  module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
      .when('/library/usergroups', {
        templateUrl: 'src/core/usergroups/view.all.html'
      });
    }
  ]);

})();
