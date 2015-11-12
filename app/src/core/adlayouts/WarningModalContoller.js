define(['./module'], function (module) {
  'use strict';

  module.controller('core/adlayouts/WarningModalController', function ($scope, $modalInstance) {
    $scope.done = function () {
      $modalInstance.close(true);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss(false);
    };
  });
});