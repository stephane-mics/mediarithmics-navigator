define(['./module'], function (module) {
  'use strict';

  module.controller('core/settings/sites/CreateRuleUserAccountController',
    function ($scope, $uibModalInstance) {
      $scope.hashFunctions = ["SHA_256", "MD5"];

      $scope.rule = {
        type: "USER_ACCOUNT_ID_CREATION",
        hash_function: $scope.hashFunctions[0],
        remove_source: 'false',
        to_lower_case: 'false'
      };

      $scope.done = function () {
        $uibModalInstance.close($scope.rule);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss(false);
      };
    });
})
;