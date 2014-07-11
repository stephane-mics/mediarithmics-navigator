define(['./module.js'], function () {
  'use strict';

  var module = angular.module('core/keywords');

  module.controller('core/keywords/DeleteController', [
    '$scope', '$modalInstance', '$location', '$route',
    function($scope, $modalInstance, $location, $route) {

      $scope.done = function() {
        $scope.keywordsList.remove().then(function (){
          $modalInstance.close();
          $location.path("/library/keywordslists");
          $route.reload();
        });
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});



