define(['./module'], function (module) {
  'use strict';

  module.controller('core/goals/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$uibModal',
    function($scope, Restangular, Session, $location, $uibModal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('goals').getList({organisation_id: organisationId, archived: false}).then(function (goals) {
        $scope.goals = goals;
      });

      $scope.createGoal = function (type) {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/goals/");
      };

      $scope.editGoal = function (goal) {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/goals/"+ goal.id);
      };

      $scope.getGoalReportUrl = function(goal) {
        return "/" + goal.organisation_id + "/goals/" + goal.id + "/report";
      };

      $scope.archiveGoal = function (goal) {
        var newScope = $scope.$new(true);
        newScope.goal = goal;
        $uibModal.open({
          templateUrl: 'src/core/goals/archive.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/goals/ArchiveController'
        });

        return false;
      };
    }
  ]);

});
