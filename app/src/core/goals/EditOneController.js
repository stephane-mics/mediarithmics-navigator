define(['./module'], function (module) {

  'use strict';


  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('core/goals/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', '$state','$modal',
    function ($scope, $log, Restangular, Session, _, $stateParams, $location, $state,$modal) {
      var goalId = $stateParams.goal_id;

      if (!goalId) {
        $scope.goal = {type: 'organisation_goal'};
        $scope.conditions = [];
      } else {
        Restangular.one("goals", goalId).get().then(function (goal) {
          $scope.goal = goal;
          $scope.triggers = goal.all("triggers").getList().$object;
           goal.all("attribution_models").getList().then(function (attributionModels) {
            $scope.attributionModels = attributionModels;

            $scope.defaultAttributionModel = _.find(attributionModels, {'default': true}, 'id').id;
          } );
          

        });
      }


      

      $scope.updateDefaultAttributionModel = function (attributionModel) {
        attributionModel.default = true;
        attributionModel.put().then(function (r) {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });

        return;
      };

      $scope.addTrigger = function (type) {
        $scope.triggers.post({"type":"GOAL_TRIGGER", "goal_trigger_type":type}).then(function (r) {
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

      $scope.$on("mics-attribution-model:selected", function (event, attributionModel) {
          $scope.attributionModels.post({"attribution_model_id":attributionModel.id, "attribution_type": 'WITH_PROCESSOR'}).then(function (r) {
           $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
      });

      $scope.addAttributionModel = function (type) {
        $modal.open({
            templateUrl: 'src/core/goals/ChooseAttributionModel.html',
            scope: $scope,
            backdrop: 'static',
            controller: 'core/goals/ChooseAttributionModelController',
            size: "lg"
          });

        return;
      };

      $scope.addDirectAttributionModel = function (type) {
        $scope.attributionModels.post({"attribution_type":"DIRECT"}).then(function (r) {
           $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });

        return;
      };

      $scope.deleteAttributionModel = function (attribution) {
        attribution.remove().then(function (r) {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });

        return;
      };

      $scope.editTrigger = function (trigger) {
        $state.go('library/queries/edit', {"organisation_id": Session.getCurrentWorkspace().organisation_id,"query_id":trigger.query_id, "ctx":"goal", "returnState": $location.path()}, {
            
          });
        
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

