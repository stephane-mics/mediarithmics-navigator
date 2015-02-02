define(['./module'], function (module) {
  'use strict';

  module.directive("micsScenarioInputStatus", [
    function () {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: "src/core/scenarios/inputs/inputStatusTemplate.html",
        scope : {
          "input" : "=micsScenarioInputStatus",
          "scenario" : "="
        },
        controller : [
          "$scope", "Restangular", "core/common/ErrorService",
          function ($scope, Restangular, errorService) {

            var updateScenarioInputStatus = function (input, status) {
              Restangular.one("scenarios", $scope.scenario.id).one('inputs', input.id).customPUT({
                status : status,
                type: input.type
              }).then(function(returnedScenarioInput) {
                input.status = returnedScenarioInput.status;
              }, function failure(response) {
                errorService.showErrorModal({
                  error: response,
                  messageType:"simple"
                });
              });
            };

            $scope.activateScenarioInput = function (input) {
              updateScenarioInputStatus(input, "ACTIVE");
            };

            $scope.pauseScenarioInput = function (input) {
              updateScenarioInputStatus(input, "PAUSED");
            };

          }
        ]
      };
    }
  ]);
});



