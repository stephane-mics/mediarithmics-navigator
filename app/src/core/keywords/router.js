define(['./module'], function (module) {

  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('library/keywordslists', {
          url:'/{organisation_id}/library/keywordslists',
          templateUrl: 'src/core/keywords/view.all.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/library/library-sidebar.html',
              selected: 'keywords_lists'
            }
          }
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
