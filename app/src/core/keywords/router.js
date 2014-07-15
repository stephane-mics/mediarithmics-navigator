define(['./module'], function () {

  'use strict';

  var module = angular.module('core/keywords');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('library/keywordslists', {
          url: '/library/keywordslists',
          templateUrl: 'src/core/keywords/view.all.html'
        })
        .state('library/keywordslists/new', {
          url: '/library/keywordslists/new',
          templateUrl: 'src/core/keywords/edit.one.html',
          topbar: false
        })
        .state('library/keywordslists/edit', {
          url: '/library/keywordslists/:keywordslist_id',
          templateUrl: 'src/core/keywords/edit.one.html',
          topbar: false
        }).state('library/keywordslists/create', {
          url: '/library/keywordslists',
          templateUrl: 'src/core/keywords/edit.one.html',
          topbar: false
        });
    }
  ]);

});
