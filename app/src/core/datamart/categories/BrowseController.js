define(['./module'], function () {

  'use strict';

  var module = angular.module('core/datamart/categories');

  module.controller('core/datamart/categories/BrowseController', [
    '$scope', '$routeParams', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session',

    function($scope, $routeParams, Restangular, Common, Session) {

      $scope.baseUrl = '#/datamart/categories';
      $scope.itemUrl = '#/datamart/items';

      $scope.datamartId = Session.getCurrentWorkspace().datamart_id;
      $scope.categoriesPerPage = 10;

      if ($routeParams.categoryId) {
        // SINGLE CATEGORY VIEW

        $scope.refreshCategories = function () {
          // get parent categories
          Restangular.one('datamarts', $scope.datamartId).one('categories', $routeParams.categoryId).all('parent_categories').getList({ sameMarket: true, sameLanguage:true }).then(function (result){
            $scope.parents = result;
            if ($scope.parents.length === 0) {
              $scope.parents = [{ id:'', name:'Catalog' }];
            }
          });
          // get sub-categories
          Restangular.one('datamarts', $scope.datamartId).one('categories', $routeParams.categoryId).all('sub_categories').getList({ sameMarket: true, sameLanguage:true }).then(function (result){
            $scope.categories = result;
          });
        };

        $scope.refreshDatasheets = function () {
          Restangular.one('datamarts', $scope.datamartId).one('categories', $routeParams.categoryId).all('datasheets').getList({ sameMarket: true, sameLanguage:true }).then(function (result) {
            $scope.datasheets = result;
          });
        };

        Restangular.one('datamarts', $scope.datamartId).one('categories', $routeParams.categoryId).get().then(function (result){
          $scope.currentCategory = result;
          $scope.refreshCategories();
          $scope.refreshDatasheets();
        });

      } else {
        // CATALOG VIEW

        $scope.currentCategory = null;

        $scope.refreshCategories = function (offset, limit) {
          // handle 'All' options in market and language selector
          var market = null;
          if ($scope.market !== null) {
            market = $scope.market.market;
          } else {
            $scope.language = null;
          }
          // get all categories by query
          Restangular.one('datamarts', $scope.datamartId).all('categories').getList({ market:market, language: $scope.language, offset: offset, limit: limit }).then(function (result){
            $scope.categories = result;
          });
        };

        // in catalog view, show all items
        $scope.refreshDatasheets = function (offset, limit) {
          Restangular.one('datamarts', $scope.datamartId).all('datasheets/search/').getList({ offset: offset, limit: limit }).then(function (result) {
            $scope.datasheets = result;
          });
        };

        // fetch market definitions
        Restangular.one('datamarts', $scope.datamartId).all('default-catalog/markets/').getList().then(function (definedMarkets) {
          $scope.definedMarkets = definedMarkets;
          $scope.market = definedMarkets[0];
          $scope.language = definedMarkets[0].languages[0];

          // attach watchers: query with resetting the paging also
          $scope.$watchCollection('[market, language]', function() {
            $scope.refreshCategories(0, $scope.categoriesPerPage);
          });

          $scope.refreshCategories(0, $scope.categoriesPerPage);
          $scope.refreshDatasheets(0, 10);
        });

      }

      // add languageMapping controls
      $scope.languageMapping = Common.languageMapping;
    }
  ]);

});
