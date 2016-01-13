define(['./module'], function (module) {
  'use strict';

  module.controller('core/settings/sites/CreateRuleAutoMatchController',
    function ($scope, $uibModalInstance) {
      $scope.rule = {
        type: "CATALOG_AUTO_MATCH",
        auto_match_type: Object.keys($scope.autoMatchTypes)[0]
      };

      console.log("rule", $scope.rule);
      $scope.done = function () {
        $uibModalInstance.close($scope.rule);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss(false);
      };
    });
})
;