define(['./module'], function (module) {

  'use strict';



  module.controller('core/datamart/items/ViewOneController', [
    '$scope', '$stateParams', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session',
    function($scope, $stateParams, Restangular, Common, Session) {

      $scope.categoryUrl = '#/' + $stateParams.organisation_id + '/datamart/categories/' + $stateParams.catalogId ;

      // pass datamartId from other controller
      var datamartId =  Session.getCurrentDatamartId();
      var datasheets = Restangular.one('datamarts', datamartId).one('items', $stateParams.itemId).all('catalog_items');
      datasheets.getList({"catalog_id": $stateParams.catalogId}).then(function (result) {
        $scope.datasheet = result[0];
//.('categories').getList().then(function (result) {
        Restangular.one('datamarts', datamartId).one('catalogs', $stateParams.catalogId).one('catalog_items', result[0].item_in_catalog_id).all('categories').getList().then(function (result) {
          $scope.categories = result;
        });
      });

      // add languageMapping controls
      $scope.languageMapping = Common.languageMapping;

    }
  ]);

});
