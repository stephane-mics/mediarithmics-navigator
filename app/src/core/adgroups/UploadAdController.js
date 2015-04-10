define(['./module'], function () {
  'use strict';

  var module = angular.module('core/adgroups');

  module.controller('core/adgroups/UploadAdController', [
    '$scope', '$modalInstance',
    function($scope, $modalInstance) {

      $scope.canSave = false;

      $scope.done = function() {
        $scope.$broadcast("display-ad/basic-editor:save");
      };

      $scope.$on("display-ad/basic-editor:saved", function () {
        $modalInstance.close();
      });

      $scope.$on("display-ad/basic-editor:asset-added", function () {
        $scope.canSave = true;
      });

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});

