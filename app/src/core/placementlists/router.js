define(['./module'], function () {

  'use strict';

  var module = angular.module('core/placementlists');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
      .state('library/placementlists', {
          url:'/{organisation_id}/library/placementlists',
        templateUrl: 'src/core/placementlists/view.all.html'
      })
        .state('library/placementlists/edit', {
          url:'/{organisation_id}/library/placementlists/:type/:placementlist_id',
          templateUrl: 'src/core/placementlists/edit.one.html',
          topbar : false
        })
      .state('library/placementlists/create', {
        url:'/{organisation_id}/library/placementlists/:type',
        templateUrl: 'src/core/placementlists/edit.one.html',
        topbar : false
      });
    }
  ]);


});
