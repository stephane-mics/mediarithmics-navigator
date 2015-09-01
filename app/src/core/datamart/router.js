define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('datamart/overview', {
          url: '/:organisation_id/datamart/overview',
          templateUrl: 'src/core/datamart/index.html'
        })
        .state('datamart/items', {
          url: '/:organisation_id/datamart/items',
          templateUrl: 'src/core/datamart/items/view.all.html'
        })
        .state('datamart/items/:catalogId/:itemId', {
          url: '/:organisation_id/datamart/items/:catalogId/:itemId',
          templateUrl: 'src/core/datamart/items/view.one.html'
        })
        .state('datamart/categories/:catalogId', {
          url: '/:organisation_id/datamart/categories/:catalogId',
          templateUrl: 'src/core/datamart/categories/browse.html'
        })
        .state('datamart/categories/:catalogId/:categoryId', {
          url: '/:organisation_id/datamart/categories/:catalogId/:categoryId',
          templateUrl: 'src/core/datamart/categories/browse.html'
        })
        .state('datamart/users', {
          url: '/:organisation_id/datamart/users',
          templateUrl: 'src/core/datamart/users/view.all.html'
        })
        .state('datamart/users/:userId', {
          url: '/:organisation_id/datamart/users/:userId',
          templateUrl: 'src/core/datamart/users/view.one.html'
        })
        .state('datamart/users/upid/:upid', {
          url: '/:organisation_id/datamart/users/upid/:upid',
          templateUrl: 'src/core/datamart/users/view.one.html'
        })
        .state('datamart/users/:userId/live', {
          url: '/:organisation_id/datamart/users/:userId/live/:live',
          templateUrl: 'src/core/datamart/users/view.one.html'
        })
        .state('datamart/users/upid/:upid/live', {
          url: '/:organisation_id/datamart/users/upid/:upid/live/:live',
          templateUrl: 'src/core/datamart/users/view.one.html'
        });
    }
  ]);
});
