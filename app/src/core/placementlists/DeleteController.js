define(['./module.js'], function () {
  'use strict';

  var module = angular.module('core/placementlists');

  module.controller('core/placementlists/DeleteController', [
    '$scope', '$modalInstance', '$location', '$route',
    function($scope, $modalInstance, $location, $route) {

      $scope.done = function() {
        $scope.placementList.remove().then(function (){
          $modalInstance.close();
          $location.path("/library/placementlists");
          $route.reload();
        });
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});



