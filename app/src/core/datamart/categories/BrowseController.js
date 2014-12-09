define(['./module'], function () {

  'use strict';

  var module = angular.module('core/datamart/categories');

  module.controller('core/datamart/categories/BrowseController', [
    '$scope', '$location','$stateParams', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session', 'lodash',

    function($scope, $location, $stateParams, Restangular, Common, Session, lodash) {

      $scope.catalogBase = '#/datamart/categories/'
      $scope.baseUrl = '#/datamart/categories/'+$stateParams.catalogId;
      $scope.itemUrl = '#/datamart/items';

      $scope.datamartId = Session.getCurrentDatamartId();
      $scope.categoriesPerPage = 10;

      if ($stateParams.categoryId && $stateParams.catalogId) {
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
          Restangular.one('datamarts', $scope.datamartId).one('catalogs', $stateParams.catalogId).one('categories', $stateParams.categoryId).all('catalog_items').getList({ sameMarket: true, sameLanguage:true }).then(function (result) {
            $scope.datasheets = result;
          });
        };

        Restangular.one('datamarts', $scope.datamartId).one('catalogs', $stateParams.catalogId).one('categories', $stateParams.categoryId).get().then(function (result){
          $scope.currentCategory = result;
          $scope.refreshCategories();
          $scope.refreshDatasheets();
        });

      } else if ($stateParams.catalogId){
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
          Restangular.one('datamarts', $scope.datamartId).one('catalogs', $stateParams.catalogId).all('catalog_items/search/').getList({ offset: offset, limit: limit }).then(function (result) {
            $scope.datasheets = result;
          });
        };

        // fetch market definitions
         $scope.refreshCategories(0, $scope.categoriesPerPage);
         $scope.refreshDatasheets(0, 10);

      } else {

        $scope.currentCategory = null;
      }

      Restangular.one('datamarts', $scope.datamartId).all('catalogs').getList().then(function (catalogs) {
         $scope.catalogs = catalogs
         if($stateParams.catalogId) {
          $scope.catalog = lodash.find(catalogs, {"$catalog_id": $stateParams.catalogId})
         }

//         $scope.refreshCategories(0, $scope.categoriesPerPage);
//         $scope.refreshDatasheets(0, 10);
      });

      $scope.changeCatalog =  function() {
        if($scope.catalog) {
          $location.path('/datamart/categories/'+$scope.catalog.$catalog_id)
        }
      }


      // add languageMapping controls
      $scope.languageMapping = Common.languageMapping;
    }
  ]);

});
