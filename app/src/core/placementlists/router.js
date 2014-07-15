define(['./module'], function () {

  'use strict';

  var module = angular.module('core/placementlists');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
      .state('library/placementlists', {
          url: '/library/placementlists',
        templateUrl: 'src/core/placementlists/view.all.html'
      })
        .state('library/placementlists/edit', {
          url: '/library/placementlists/:type/:placementlist_id',
          templateUrl: 'src/core/placementlists/edit.one.html',
          topbar : false
        })
      .state('library/placementlists/create', {
        url: '/library/placementlists/:type',
        templateUrl: 'src/core/placementlists/edit.one.html',
        topbar : false
      });
    }
  ]);


});
