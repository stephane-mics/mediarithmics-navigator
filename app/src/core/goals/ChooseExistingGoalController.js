define(['./module'], function (module) {
  'use strict';

  module.controller('core/goals/ChooseExistingGoalController', [
    '$scope', '$modalInstance', '$document', '$log', "Restangular", 'core/common/auth/Session',
    function ($scope, $modalInstance, $document, $log, Restangular, Session) {
      $scope.availableGoals = Restangular.all("goals").getList({"organisation_id": $scope.campaign.organisation_id}).$object;
      $scope.selectedGoals = [];

      $scope.done = function () {      
        for (var i = 0; i < $scope.selectedGoals.length; i++) {
          $scope.$emit("mics-goal:selected", $scope.selectedGoals[i]);
        }

        
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.close();
      };
    }
  ]);
});


