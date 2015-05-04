define(['./module'], function (module) {
  'use strict';

  module.controller('core/goals/ChooseAttributionModelController', [
    '$scope', '$modalInstance', '$document', '$log', "Restangular", 'core/common/auth/Session',
    function ($scope, $modalInstance, $document, $log, Restangular, Session) {
      $scope.attributionModels = Restangular.all("attribution_models").getList({"organisation_id": $scope.goal.organisation_id}).$object;
      $scope.selectedAttributionModels = [];

      $scope.done = function () {      
        for (var i = 0; i < $scope.selectedAttributionModels.length; i++) {
          $scope.$emit("mics-attribution-model:selected", $scope.selectedAttributionModels[i]);
        }

        
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.close();
      };
    }
  ]);
});


