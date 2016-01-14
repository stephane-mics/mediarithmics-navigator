define(['./module'], function (module) {
  'use strict';

  module.controller('core/settings/sites/CreateAliasController', function ($scope, $uibModalInstance) {
    $scope.done = function () {
      console.log("ALIAS", $scope.alias);
      if ($scope.alias) {
        $uibModalInstance.close({name: $scope.alias});
      }
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss(false);
    };
  });
});