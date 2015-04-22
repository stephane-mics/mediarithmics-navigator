define(['./module'], function () {

  'use strict';


  var module = angular.module('core/goals');

  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('core/goals/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', '$state',
    function ($scope, $log, Restangular, Session, _, $stateParams, $location, $state) {
      var goalId = $stateParams.goal_id;

      if (!goalId) {
        $scope.goal = {type: 'organisation_goal'};
        $scope.conditions = [];
      } else {
        Restangular.one("goals", goalId).get().then(function (goal) {
          $scope.goal = goal;
          $scope.triggers = goal.all("triggers").getList().$object;
        });
      }

      

      $scope.addTrigger = function (type) {
        $scope.triggers.post({"type":type}, {"scenario_id": goalId}).then(function (r) {
          $scope.editTrigger(r);
        });

        return;
      };

      $scope.deleteTrigger = function (trigger) {
        trigger.remove({"scenario_id": goalId}).then(function (r) {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });

        return;
      };

      $scope.editTrigger = function (trigger) {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/queries/" + trigger.query_id);
      };


      $scope.done = function () {

        var promise = null;
        if (goalId) {
          promise = $scope.goal.put();

        } else {
          promise = Restangular.all('goals').post($scope.goal, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        }
        promise.then(function success() {
          $log.info("success");
          $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/goals");
        }, function failure() {
          $log.info("failure");
        });

      };
      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/goals");
      };
    }


  ]);
});

