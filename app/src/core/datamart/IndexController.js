(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.controller('core/datamart/IndexController', [
    '$scope', '$route', 'core/datamart/common/Common',
    function($scope, $route, Common) {
      $scope.locations = Common.locations;
    }
  ]);

})();
