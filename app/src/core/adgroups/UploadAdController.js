define(['./module'], function () {
  'use strict';

  var module = angular.module('core/adgroups');

  module.controller('core/adgroups/UploadAdController', [
    '$scope', '$modalInstance',
    function($scope, $modalInstance) {

      $scope.canSave = false;

      $scope.done = function() {
        $scope.$broadcast("com.mediarithmics.creative.display/basic-editor:save");
      };

      $scope.$on("com.mediarithmics.creative.display/basic-editor:saved", function () {
        $modalInstance.close();
      });

      $scope.$on("com.mediarithmics.creative.display/basic-editor:asset-added", function () {
        $scope.canSave = true;
      });

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});

