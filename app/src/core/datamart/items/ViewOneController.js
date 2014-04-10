(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.controller('core/datamart/items/ViewOneController', [
    '$scope', '$routeParams', 'Restangular', 'core/datamart/common/Common',
    function($scope, $routeParams, Restangular, Common) {

      $scope.categoryUrl = '#' + Common.locations.all[2].href;

      // pass datamartId from other controller
      var datasheets = Restangular.one('datamarts', 8).one('datasheets', $routeParams.itemId);
      datasheets.get().then(function (result) {
        $scope.datasheet = result;

        datasheets.all('categories').getList().then(function (result) {
          $scope.categories = result;
        });
      });

    }
  ]);

})();