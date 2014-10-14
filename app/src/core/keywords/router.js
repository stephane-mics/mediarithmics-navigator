define(['./module'], function () {

  'use strict';

  var module = angular.module('core/keywords');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('library/keywordslists', {
          url:'/{organisation_id}/library/keywordslists',
          templateUrl: 'src/core/keywords/view.all.html'
        })
        .state('library/keywordslists/new', {
          url:'/{organisation_id}/library/keywordslists/new',
          templateUrl: 'src/core/keywords/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        })
        .state('library/keywordslists/edit', {
          url:'/{organisation_id}/library/keywordslists/:keywordslist_id',
          templateUrl: 'src/core/keywords/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        })
        .state('library/keywordslists/create', {
          url:'/{organisation_id}/library/keywordslists',
          templateUrl: 'src/core/keywords/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        });
    }
  ]);

});
