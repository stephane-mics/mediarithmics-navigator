define(['./module'], function () {

  'use strict';

  var module = angular.module('core/datamart/categories');

  module.controller('core/datamart/categories/BrowseController', [
    '$scope', '$stateParams', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session',

    function($scope, $stateParams, Restangular, Common, Session) {

      $scope.catalogBase = '#/datamart/categories/'
      $scope.baseUrl = '#/datamart/categories/'+$stateParams.catalogId;
      $scope.itemUrl = '#/datamart/items';

      $scope.datamartId = Session.getCurrentWorkspace().datamart_id;
      $scope.categoriesPerPage = 10;

      if ($stateParams.categoryId) {
        // SINGLE CATEGORY VIEW

        $scope.refreshCategories = function () {
          // get parent categories
          Restangular.one('datamarts', $scope.datamartId).one('catalogs', $stateParams.catalogId).one('categories', $stateParams.categoryId).all('parent_categories').getList({ sameMarket: true, sameLanguage:true }).then(function (result){
            $scope.parents = result;
            if ($scope.parents.length === 0) {
              $scope.parents = [{ id:'', name:'Catalog' }];
            }
          });
          // get sub-categories
          Restangular.one('datamarts', $scope.datamartId).one('catalogs', $stateParams.catalogId).one('categories', $stateParams.categoryId).all('sub_categories').getList({ sameMarket: true, sameLanguage:true }).then(function (result){
            $scope.categories = result;
          });
        };

        $scope.refreshDatasheets = function (catalogId) {
          Restangular.one('datamarts', $scope.datamartId).one('catalogs', $stateParams.catalogId).one('categories', $stateParams.categoryId).all('itemInCatalogs').getList({ sameMarket: true, sameLanguage:true }).then(function (result) {
            $scope.datasheets = result;
          });
        };

        Restangular.one('datamarts', $scope.datamartId).one('catalogs', $stateParams.catalogId).one('categories', $stateParams.categoryId).get().then(function (result){
          $scope.currentCategory = result;
          $scope.refreshCategories();
          $scope.refreshDatasheets();
        });

      } else {
        // CATALOG VIEW

        $scope.currentCategory = null;

        $scope.refreshCategories = function (offset, limit) {
          // get all categories by query
          Restangular.one('datamarts', $scope.datamartId).one('catalogs', $stateParams.catalogId).all('categories').getList({ offset: offset, limit: limit }).then(function (result){
            $scope.categories = result;
          });
        };

        // in catalog view, show all items
        $scope.refreshDatasheets = function (offset, limit) {
          Restangular.one('datamarts', $scope.datamartId).one('catalogs', $stateParams.catalogId).all('itemInCatalogs/search/').getList({ offset: offset, limit: limit }).then(function (result) {
            $scope.datasheets = result;
          });
        };

        // fetch market definitions
         Restangular.one('datamarts', $scope.datamartId).all('catalogs').getList().then(function (catalogs) {
                  // attach watchers: query with resetting the paging also
//                  $scope.$watchCollection('[market, language]', function() {
//                    $scope.refreshCategories(0, $scope.categoriesPerPage);
//                  });
          $scope.catalogs = catalogs
                  $scope.refreshCategories(0, $scope.categoriesPerPage);
                  $scope.refreshDatasheets(0, 10);
                });


      }

      // add languageMapping controls
      $scope.languageMapping = Common.languageMapping;
    }
  ]);

});
