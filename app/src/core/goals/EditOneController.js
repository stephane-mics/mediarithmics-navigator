define(['./module'], function (module) {

  'use strict';



  module.controller('core/goals/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', '$state','$uibModal',
    'core/datamart/queries/QueryContainer', '$q', 'core/common/promiseUtils', 'async',
    function ($scope, $log, Restangular, Session, _, $stateParams, $location, $state,$uibModal,QueryContainer, $q, promiseUtils, async) {
      var goalId = $stateParams.goal_id;
      var triggerDeletionTask = false;
      var datamartId = Session.getCurrentDatamartId();
      var queryId = -1;
      var deletedAttributionModels = [];

      var AttributionModelContainer = function AttributionModelContainer(value) {
        this.selectedAsDefault = "false";

        if (value) {
            this.value = value;
            this.id = value.id;

            if (value.default){
              this.selectedAsDefault = "true";
            }
        }

      };

      if (!goalId) {
        $scope.goal = {type: 'organisation_goal', goal_value_currency:'EUR', default_goal_value: 0};
      } else {
        Restangular.one("goals", goalId).get().then(function (goal) {
          $scope.goal = goal;

          goal.all("attribution_models").getList().then(function (attributionModels) {
            $scope.attributionModels = attributionModels.map(function(attributionModel){
              return new AttributionModelContainer(attributionModel);
            });
          } );

          //load goal query if any
          if (goal.new_query_id){
            var queryContainer = new QueryContainer(datamartId, goal.new_query_id);
            queryContainer.load().then(function sucess(loadedQueryContainer){
              $scope.queryContainer = loadedQueryContainer;
            }, function error(reason){
              if (reason.data && reason.data.error_id){
                $scope.error = "An error occured while loading trigger , errorId: " + reason.data.error_id;
              } else {
                $scope.error = "An error occured while loading trigger";
              }
            });
          }

        });
      }

      $scope.updateDefaultAttributionModel = function (attributionModel) {
        var previousDefault = $scope.attributionModels.find(function(el){return el.selectedAsDefault === "true";});
        previousDefault.selectedAsDefault = "false";
        previousDefault.value.default = false;

        attributionModel.selectedAsDefault = "true";
        attributionModel.value.default = true;
      };

      $scope.$on("mics-attribution-model:selected", function (event, data) {

        var alreadySelected = $scope.attributionModels.find(function(model){
          return model.value.attribution_model_id === data.attributionModel.id;
        });

        if (!alreadySelected){
          var selectedAttributionModel = {
            attribution_model_id: data.attributionModel.id,
            attribution_model_name: data.attributionModel.name,
            group_id: data.attributionModel.group_id,
            artifact_id: data.attributionModel.artifact_id,
            attribution_type:'WITH_PROCESSOR'
          };

          if ($scope.attributionModels.length === 0){
            selectedAttributionModel.default = "true";
          }

          $scope.attributionModels.push(new AttributionModelContainer(selectedAttributionModel));
        }      
      });

      $scope.addAttributionModel = function (type) {
        $uibModal.open({
            templateUrl: 'src/core/attributionmodels/ChooseExistingAttributionModel.html',
            scope: $scope,
            backdrop: 'static',
            controller: 'core/attributionmodels/ChooseExistingAttributionModelController',
            size: "lg"
          });

        return;
      };

      $scope.addDirectAttributionModel = function (type) {

        var existingDirectModel = $scope.attributionModels.find(function(model){
          return model.value.attribution_type === 'DIRECT';
        });

        if (!existingDirectModel){
          var directAttributionModel = {
            attribution_type:'DIRECT'
          };

          if ($scope.attributionModels.length === 0){
            directAttributionModel.default = "true";
          }

          $scope.attributionModels.push(new AttributionModelContainer(directAttributionModel));
        }
      };

      $scope.deleteAttributionModel = function (attribution) {
        if (attribution.id){
          deletedAttributionModels.push(attribution);
        }

        var i = $scope.attributionModels.indexOf(attribution);
        $scope.attributionModels.splice(i, 1);

        if ($scope.attributionModels.length > 0 && attribution.selectedAsDefault === "true"){
          var first = $scope.attributionModels[0];
          first.selectedAsDefault = "true";
          first.value.default = true;
        }
      };

      $scope.addTrigger = function () {
        var newScope = $scope.$new(true);
        newScope.queryContainer = new QueryContainer(datamartId);
        $uibModal.open({
          templateUrl: 'src/core/goals/edit-query.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/goals/EditQueryController',
          windowClass: 'edit-query-popin'
        }).result.then(function ok(queryContainerUpdate){
          $scope.queryContainer = queryContainerUpdate;
        }, function cancel(){
          $log.debug("Edit Query model dismissed");
        });
      };

      $scope.editTrigger = function (queryId) {
        var newScope = $scope.$new(true);
        newScope.queryContainer = $scope.queryContainer.copy();
        $uibModal.open({
          templateUrl: 'src/core/goals/edit-query.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/goals/EditQueryController',
          windowClass: 'edit-query-popin'
        }).result.then(function ok(queryContainerUpdate){
          $scope.queryContainer = queryContainerUpdate;
        }, function cancel(){
          $log.debug("Edit Query model dismissed");
        });
      };

      $scope.removeTrigger = function () {
        $scope.queryContainer = null;
        if ($scope.goal.new_query_id){
          queryId = $scope.goal.new_query_id;
          $scope.goal.new_query_id = null;
          triggerDeletionTask = true;
        }
      };

      function getAttributionModelTasks() {
        var deleteAttributionModelTasks = deletedAttributionModels.map(function (attribution){
          return function(callback) {
            promiseUtils.bindPromiseCallback(attribution.value.remove(), callback);
          };
        });

        var updateAttributionModelTasks = $scope.attributionModels.filter(function (attribution){
          return attribution.id;
        }).map(function (attribution){
          return function(callback) {
            promiseUtils.bindPromiseCallback(attribution.value.put(), callback);
          };
        });

        var createAttributionModelTasks = $scope.attributionModels.filter(function (attribution){
          return !attribution.id;
        }).map(function (attribution){
          return function(callback) {
            var promise = $scope.goal.all("attribution_models").post({"attribution_model_id":attribution.value.attribution_model_id, "attribution_type": attribution.value.attribution_type});
            promiseUtils.bindPromiseCallback(promise, callback);
          };
        });

        var attributionModelTasks = [];
        attributionModelTasks = attributionModelTasks.concat(deleteAttributionModelTasks);
        attributionModelTasks = attributionModelTasks.concat(updateAttributionModelTasks);
        attributionModelTasks = attributionModelTasks.concat(createAttributionModelTasks);

        return attributionModelTasks;

      }

      function saveOrUpdateGoal(){

        var promise;
        if (!goalId) {
          promise = Restangular.all('goals').post($scope.goal, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        } else {
          promise = $q.resolve($scope.goal);
        }

        promise.then(function (goal){
          $scope.goal = goal;
          var deferred = $q.defer();
          var attributionP = deferred.promise;
          async.series(getAttributionModelTasks(), function(err, res){
            if (err) {
              deferred.reject(err);
            } else {
              deferred.resolve(res);
            }
          });
          return attributionP;
        }).then(function () {
          return $scope.goal.put();
        }).then(function (){
          if (triggerDeletionTask){
            return Restangular.one('datamarts', datamartId).one('queries', queryId).remove();
          } else {
            return $q.resolve();
          }
        }).then(function success() {
            $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/goals");
        }, function error(reason){
          if (reason.data && reason.data.error_id){
            $scope.error = "An error occured while saving goal , errorId: " + reason.data.error_id;
          } else {
            $scope.error = "An error occured while saving goal";
          }
        });
      }

      $scope.done = function () {

        if ($scope.queryContainer){
          $scope.queryContainer.saveOrUpdate().then(function sucess(updateQueryContainer){
            if (!$scope.goal.new_query_id){
              $scope.goal.new_query_id = updateQueryContainer.id;
            }
            saveOrUpdateGoal();
          }, function error(reason){
            if (reason.data && reason.data.error_id){
              $scope.error = "An error occured while saving query , errorId: " + reason.data.error_id;
            } else {
              $scope.error = "An error occured while saving query";
            }
          });
        } else {
          saveOrUpdateGoal();
        }

      };

      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/goals");
      };

    }


  ]);
});
