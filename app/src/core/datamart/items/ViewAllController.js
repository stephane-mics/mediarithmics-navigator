define(['./module'], function (module) {

  'use strict';


  module.controller('core/datamart/items/ViewAllController', [
    '$scope', '$route', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session',
    function($scope, $route, Restangular, Common, Session) {

      $scope.baseUrl = '#' + Common.locations.current.href;

      $scope.datamartId = Session.getCurrentWorkspace().datamart_id;


      $scope.refreshDatasheets = function refreshDatasheets(offset, limit) {

        Restangular.one('datamarts', $scope.datamartId).one('catalogs', $scope.catalog.$catalog_id).all('catalog_items/search/').getList({ terms: $scope.searchTerms, offset: offset, limit: limit})
          .then(function (result) {
            $scope.datasheets = result;
          });
      };


      Restangular.one('datamarts', $scope.datamartId).all('catalogs').getList().then(function (catalogs) {
         $scope.catalogs = catalogs
         if($stateParams.catalogId) {
          $scope.catalog = lodash.find(catalogs, {"$catalog_id": $stateParams.catalogId})
         }

//         $scope.refreshCategories(0, $scope.categoriesPerPage);
//         $scope.refreshDatasheets(0, 10);
      });

//      $scope.changeCatalog =  function() {
//        if($scope.catalog) {
//          $location.path('/datamart/categories/'+$scope.catalog.$catalog_id)
//        }
//      }


      // add languageMapping controls
      $scope.languageMapping = Common.languageMapping;

    }
  ]);

});
