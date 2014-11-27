define(['./module'], function (module) {

  'use strict';



  module.controller('core/datamart/items/ViewOneController', [
    '$scope', '$stateParams', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session',
    function($scope, $stateParams, Restangular, Common, Session) {

      $scope.categoryUrl = '#/datamart/categories' ;

      // pass datamartId from other controller
      var datamartId = Session.getCurrentWorkspace().datamart_id;
      var datasheets = Restangular.one('datamarts', datamartId).one('itemInCatalogs', $stateParams.itemId);
      datasheets.get().then(function (result) {
        $scope.datasheet = result;

        datasheets.all('categories').getList().then(function (result) {
          $scope.categories = result;
        });
      });

      // add languageMapping controls
      $scope.languageMapping = Common.languageMapping;

    }
  ]);

});
