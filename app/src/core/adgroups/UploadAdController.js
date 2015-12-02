define(['./module'], function (module) {
  'use strict';

  module.controller('core/adgroups/UploadAdController', [
    '$scope', '$uibModalInstance',
    function ($scope, $uibModalInstance) {
      $scope.canSave = false;

      $scope.done = function () {
        $scope.$broadcast("display-ad/basic-editor:save");
      };

      $scope.$on("display-ad/basic-editor:saved", function () {
        $uibModalInstance.close();
      });

      $scope.$on("display-ad/basic-editor:asset-added", function () {
        $scope.canSave = true;
      });

      $scope.cancel = function () {
        $uibModalInstance.close();
      };
    }
  ]);
});

