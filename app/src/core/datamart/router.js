define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('datamart/overview', {
          url: '/datamart/overview',
          templateUrl: 'src/core/datamart/index.html'
        })
        .state('datamart/items', {
          url: '/datamart/items',
          templateUrl: 'src/core/datamart/items/view.all.html'
        })
        .state('datamart/items/:catalogId/:itemId', {
          url: '/datamart/items/:catalogId/:itemId',
          templateUrl: 'src/core/datamart/items/view.one.html'
        })
        .state('datamart/categories/:catalogId', {
          url: '/datamart/categories/:catalogId',
          templateUrl: 'src/core/datamart/categories/browse.html'
        })
        .state('datamart/categories/:catalogId/:categoryId', {
          url: '/datamart/categories/:catalogId/:categoryId',
          templateUrl: 'src/core/datamart/categories/browse.html'
        })
        .state('datamart/users', {
          url: '/datamart/users',
          templateUrl: 'src/core/datamart/users/view.all.html'
        })
        .state('datamart/users/:userId', {
          url: '/datamart/users/:userId',
          templateUrl: 'src/core/datamart/users/view.one.html'
        })
        .state('datamart/users/upid/:upid', {
          url: '/datamart/users/upid/:upid',
          templateUrl: 'src/core/datamart/users/view.one.html'
        });
    }
  ]);
});
