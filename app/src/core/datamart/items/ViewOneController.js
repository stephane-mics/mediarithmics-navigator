(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.controller('core/datamart/items/ViewOneController', [
    '$scope', '$routeParams', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session',
    function($scope, $routeParams, Restangular, Common, Session) {

      $scope.categoryUrl = '#/datamart/categories' ;

      // pass datamartId from other controller
      var datamartId = Session.getCurrentWorkspace().datamart_id;
      var datasheets = Restangular.one('datamarts', datamartId).one('datasheets', $routeParams.itemId);
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

})();
