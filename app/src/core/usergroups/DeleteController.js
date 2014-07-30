define(['./module'], function () {
  'use strict';

  var module = angular.module('core/usergroups');

  module.controller('core/usergroups/DeleteController', [
    '$scope', '$modalInstance', '$location', '$route',
    function($scope, $modalInstance, $location, $route) {

      $scope.done = function() {
        $scope.userGroup.remove().then(function (){
          $modalInstance.close();
          $location.path("/library/usergroups");
          $route.reload();
        });
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});



