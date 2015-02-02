define(['./module'], function () {

  'use strict';


  var module = angular.module('core/scenarios/inputs');

  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('core/scenarios/inputs/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', '$state',
    function($scope, $log, Restangular, Session, _, $stateParams, $location, $state) {
      var scenarioId = $stateParams.scenario_id;
      var inputId = $stateParams.input_id;


      Restangular.one('scenarios', scenarioId).all("inputs").one(inputId).get().then(function (input) {
        $scope.input = input;
        if (input.type === "EVENT_STREAM") {
          $scope.conditions = Restangular.one('scenario_stream_inputs', inputId).all("conditions").getList({"scenario_id": scenarioId}).$object;
        }
      });

      $scope.condition = {

      };

      $scope.addCondition = function (condition) {
        $scope.conditions.post(condition, {"scenario_id": scenarioId}).then(function (r) {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });

        return;
      };

      $scope.deleteCondition = function (condition) {
        Restangular.one('scenario_stream_inputs', inputId).all("conditions").one(condition.id).remove({"scenario_id": scenarioId}).then(function (r) {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
        return;
      };

      $scope.goToCampaign = function (campaign) {
        switch(campaign.type) {
          case "DISPLAY":
            $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/campaigns/display/report/" + campaign.id + "/basic");
            break;
          default:
            $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/campaigns");
            break;
        }
      };



      $scope.done = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios/"+scenarioId);
      };
    }
  ]);
});

