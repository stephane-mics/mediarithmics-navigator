define(['./module'], function () {

  'use strict';


  var module = angular.module('core/scenarios');

  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('core/scenarios/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location','$state',
    function($scope, $log, Restangular, Session, _, $stateParams, $location, $state) {
      var scenarioId = $stateParams.scenario_id;

      $scope.isCreationMode = !scenarioId;

      if (!scenarioId) {
        $scope.scenario = {

        };
      } else {
        Restangular.one('scenarios', scenarioId).get().then(function (scenario) {
          $scope.scenario = scenario;
        });
        Restangular.one('scenarios', scenarioId).all("inputs").getList().then(function (campaigns) {
          $scope.inputs = campaigns;
        });
        Restangular.one('scenarios', scenarioId).one("workflow").get().then(function (workflow) {
          $scope.workflow = workflow;
          if (workflow.begin_node_id == null) {
            $scope.begin_node = {

            };
          } else {
            workflow.one("begin").get().then(function (beginNode) {
              $scope.begin_node = beginNode;
              Restangular.one("campaigns", beginNode.campaign_id).get().then(function (campaign) {
                $scope.campaign = campaign;
              });
            });
          }
        });
      }

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

      $scope.addInput = function (type) {
        $scope.inputs.post({"type":type}, {"scenario_id": scenarioId}).then(function (r) {
          $scope.editInput(r.id);
        });

        return;
      };

      $scope.deleteInput = function (input) {
        input.remove({"scenario_id": scenarioId}).then(function (r) {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });

        return;
      };

      $scope.editInput = function (input) {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios/"+scenarioId+"/inputs/" + input.id);
      };

      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios");
      };

      $scope.saveBeginNode = function (beginNode) {
        Restangular.one('scenarios', scenarioId).one("workflow").post("begin", beginNode).then(function (r, error) {

          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
      };



      $scope.next = function () {
        var promise = null;
        if(scenarioId) {
          promise = $scope.scenario.put();
        } else {
          promise = Restangular.all('scenarios').post($scope.scenario, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        }
        promise.then(function success(campaignContainer){
          $log.info("success");
          $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
});

