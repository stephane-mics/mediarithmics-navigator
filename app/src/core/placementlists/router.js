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
      .state('library/placementlists/new', {
        url:'/{organisation_id}/library/placementlists/new',
        templateUrl: 'src/core/placementlists/edit.one.html',
        topbar : false
      })
      .state('library/placementlists/edit', {
        url:'/{organisation_id}/library/placementlists/:placementlist_id',
        templateUrl: 'src/core/placementlists/edit.one.html',
        topbar : false
      });
    }
  ]);


});
