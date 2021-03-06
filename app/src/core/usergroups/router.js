define(['./module'], function () {

  'use strict';

  var module = angular.module('core/usergroups');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('library/usergroups', {
          url:'/{organisation_id}/library/usergroups',
          templateUrl: 'src/core/usergroups/view.all.html'
        })
        .state('library/usergroups/edit', {
          url:'/{organisation_id}/library/usergroups/:type/:usergroup_id',
          templateUrl: 'src/core/usergroups/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        })
        .state('library/usergroups/create', {
          url:'/{organisation_id}/library/usergroups/:type',
          templateUrl: 'src/core/usergroups/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        });
    }
  ]);

});
