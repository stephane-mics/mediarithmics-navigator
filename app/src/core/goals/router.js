define(['./module'], function () {

  'use strict';

  var module = angular.module('core/goals');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
          .state('library/goals/edit', {
              url:'/{organisation_id}/library/goals/{goal_id}',
              templateUrl: 'src/core/goals/edit.one.html',
              data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
          }).state('library/goals', {
              url:'/{organisation_id}/library/goals',
              templateUrl: 'src/core/goals/view.all.html'
          });

    }
  ]);

});
