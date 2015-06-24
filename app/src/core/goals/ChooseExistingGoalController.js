define(['./module'], function (module) {
  'use strict';

  module.controller('core/goals/ChooseExistingGoalController', [
    '$scope', '$modalInstance', '$document', '$log', 'goals', 'Restangular',
    function ($scope, $modalInstance, $document, $log, goals, Restangular) {
      $scope.availableGoals = Restangular.all('goals').getList({'organisation_id': $scope.campaign.organisation_id}).$object;
      $scope.selectedGoals = goals.slice() || [];

      $scope.done = function () {
        $modalInstance.close($scope.selectedGoals);
      };

      $scope.cancel = function () {
        $modalInstance.close(goals);
      };
    }
  ]);
});


