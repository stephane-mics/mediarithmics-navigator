define(['./module'], function () {

  'use strict';

  var module = angular.module('core/usergroups');

  module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
      .when('/library/usergroups', {
        templateUrl: 'src/core/usergroups/view.all.html'
      })
      .when('/library/usergroups/:type/:usergroup_id?', {
        templateUrl: 'src/core/usergroups/edit.one.html',
        topbar : false
      });
    }
  ]);

});
