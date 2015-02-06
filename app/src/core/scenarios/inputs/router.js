define(['./module'], function () {

  'use strict';

  var module = angular.module('core/scenarios/inputs');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('library/scenarios/inputs/edit', {
            url:'/{organisation_id}/library/scenarios/{scenario_id}/inputs/{input_id}',
            templateUrl: 'src/core/scenarios/inputs/edit.one.html',
            data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        })

    }
  ]);

});
