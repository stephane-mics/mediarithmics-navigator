define(['./module'], function () {

  'use strict';


  var module = angular.module('core/scenarios');




  module.controller('core/scenarios/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location','$state','core/campaigns/DisplayCampaignService','$modal',
    function($scope, $log, Restangular, Session, _, $stateParams, $location, $state, DisplayCampaignService,  $modal) {

        function retrieveCampaignForNode($scope,node) {
            Restangular.one("campaigns", node.campaign_id).get().then(function (campaign) {
                $scope.campaigns[node.id] = campaign;
                console.log($scope.campaigns);
            });
        }
      var scenarioId = $stateParams.scenario_id;
      $scope.campaigns = {};
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
          $scope.begin_node_id = workflow.begin_node_id;
          workflow.all("nodes").getList().then(function (nodes) {
              $scope.nodes = nodes;
              for(var i = 0; i < nodes.length ; i++) {
                  retrieveCampaignForNode($scope,nodes[i])


              }
            });
        });
      }

      $scope.getCampaign = function (campaignId) {
        return $scope.campaigns[campaignId];
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

      $scope.addInput = function (type) {
        $scope.inputs.post({"type":type}, {"scenario_id": scenarioId}).then(function (r) {
          $scope.editInput(r);
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

      $scope.addCampaign = function(type) {
          if(type == 'DISPLAY') {
              $modal.open({
                  templateUrl: 'src/core/scenarios/QuickCreateCampaign.html',
                  scope : $scope,
                  backdrop : 'static',
                  controller: 'core/scenarios/QuickCreateDisplayCampaignController',
                  size: "lg"
              });
          }
          if(type == 'EMAIL') {
              $modal.open({
                  templateUrl: 'src/core/scenarios/QuickCreateCampaign.html',
                  scope : $scope,
                  backdrop : 'static',
                  controller: 'core/scenarios/QuickCreateEmailCampaignController',
                  size: "lg"
              });
          }
          if(type == 'LIBRARY') {
              $modal.open({
                  templateUrl: 'src/core/campaigns/ChooseExistingCampaign.html',
                  scope : $scope,
                  backdrop : 'static',
                  controller: 'core/campaigns/ChooseExistingCampaignController',
                  size: "lg"
              });
          }
      };
        $scope.$on("mics-campaign:selected", function (event, campaign) {
            Restangular.one('scenarios', scenarioId).one("workflow").all('nodes').post({campaign_id: campaign.id}).then(function () {
                $state.transitionTo($state.current, $stateParams, {
                    reload: true, inherit: true, notify: true
                });
            })
        });
      $scope.next = function () {
        var promise = null;
        if(scenarioId) {
          promise = $scope.scenario.put();
        } else {
          console.log("create a scenario")
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

