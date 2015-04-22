define(['./module'], function (module) {
  'use strict';

  module.directive("micsGoalTriggerStatus", [
    function () {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: "src/core/goals/goalTriggerStatusTemplate.html",
        scope : {
          "trigger" : "=micsGoalTriggerStatus",
          "goal" : "="
        },
        controller : [
          "$scope", "Restangular", "core/common/ErrorService",
          function ($scope, Restangular, errorService) {

            var updateGoalTrigger = function (goal,trigger, status) {
              trigger.customPUT({
                status : status,
                type: trigger.type
              }).then(function(returnedgoal) {
                goal.status = returnedgoal.status;
              }, function failure(response) {
                errorService.showErrorModal({
                  error: response,
                  messageType:"simple"
                });
              });
            };

            $scope.activateGoal = function (goal,trigger) {
              updateGoalTrigger(goal,trigger, "ACTIVE");
            };

            $scope.pauseGoal = function (goal,trigger) {
              updateGoalTrigger(goal,trigger, "PAUSED");
            };

          }
        ]
      };
    }
  ]);
});



