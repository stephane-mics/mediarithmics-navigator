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
          templateUrl: 'src/core/datamart/items/view.all.html',
          data: {
            category: 'catalog',
            sidebar: {
              templateUrl : 'src/core/datamart/catalog-sidebar.html',
              selected: 'items'
            }
          }
        })
        .state('datamart/items/:catalogId/:itemId', {
          url: '/:organisation_id/datamart/items/:catalogId/:itemId',
          templateUrl: 'src/core/datamart/items/view.one.html',
          data: {
            category: 'catalog',
            sidebar: {
              templateUrl : 'src/core/datamart/catalog-sidebar.html',
              selected: 'items'
            }
          }
        })
        .state('datamart/categories/:catalogId', {
          url: '/:organisation_id/datamart/categories/:catalogId',
          templateUrl: 'src/core/datamart/categories/browse.html',
          data: {
            category: 'catalog',
            sidebar: {
              templateUrl : 'src/core/datamart/catalog-sidebar.html',
              selected: 'categories'
            }
          }
        })
        .state('datamart/categories/:catalogId/:categoryId', {
          url: '/:organisation_id/datamart/categories/:catalogId/:categoryId',
          templateUrl: 'src/core/datamart/categories/browse.html',
          data: {
            category: 'catalog',
            sidebar: {
              templateUrl : 'src/core/datamart/catalog-sidebar.html',
              selected: 'categories'
            }
          }
        })
        .state('datamart/segments', {
          url: '/:organisation_id/datamart/segments',
          templateUrl: 'src/core/datamart/segments/view.all.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/datamart/datamart-sidebar.html',
              selected: 'segments'
            }
          }
        })
        .state('datamart/segments/edit', {
          url:'/{organisation_id}/datamart/segments/:type/:segment_id',
          templateUrl: 'src/core/datamart/segments/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        })
        .state('datamart/segments/create', {
          url:'/{organisation_id}/datamart/segments/:type',
          templateUrl: 'src/core/datamart/segments/edit.one.html',
          data: { navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html' }
        })     
        .state('datamart/users', {
          url: '/:organisation_id/datamart/users',
          templateUrl: 'src/core/datamart/users/view.all.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/datamart/datamart-sidebar.html',
              selected: 'search'
            }
          }
        })
        .state('datamart/users/:userId', {
          url: '/:organisation_id/datamart/users/:userId',
          templateUrl: 'src/core/datamart/users/view.one.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/datamart/datamart-sidebar.html',
              selected: 'search'
            }
          }
        })
        .state('datamart/users/upid/:upid', {
          url: '/:organisation_id/datamart/users/upid/:upid',
          templateUrl: 'src/core/datamart/users/view.one.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/datamart/datamart-sidebar.html',
              selected: 'search'
            }
          }
        })
        .state('datamart/users/:userId/live', {
          url: '/:organisation_id/datamart/users/:userId/live/:live',
          templateUrl: 'src/core/datamart/users/view.one.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/datamart/datamart-sidebar.html',
              selected: 'search'
            }
          }
        })
        .state('datamart/users/upid/:upid/live', {
          url: '/:organisation_id/datamart/users/upid/:upid/live/:live?debug',
          templateUrl: 'src/core/datamart/users/view.one.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/datamart/datamart-sidebar.html',
              selected: 'search'
            }
          }
        })
        .state('datamart/queries', {
          url: '/:organisation_id/datamart/queries',
          templateUrl: 'src/core/datamart/queries/index.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/datamart/datamart-sidebar.html',
              selected: 'query'
            }
          }
        });
    }
  ]);
});
