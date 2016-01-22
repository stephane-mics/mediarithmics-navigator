define(['./module'], function (module) {

  'use strict';


  module.controller('core/datamart/segments/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', '$uibModal',
    function($scope, $log, Restangular, Session, _, $stateParams, $location, $uibModal) {
      var segmentId = $stateParams.segment_id;
      var type = $stateParams.type;

      $scope.isCreationMode = !segmentId;
      $scope.datamartId = Session.getCurrentDatamartId();

      if (!segmentId) {
        $scope.segment = {
          type : type
        };
      } else {
        Restangular.one('audience_segments', segmentId).get().then(function (segment) {
          $scope.segment = segment;
        });
      }

      var saveSegment = function(queryId){
        var promise = null;
        if(segmentId) {
          promise = $scope.segment.put();
        } else {
          $scope.segment.query_id = queryId;
          promise = Restangular.all('audience_segments').post($scope.segment, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        }
        promise.then(function success(){
          $log.info("success");
          $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/datamart/segments");
        }, function failure(){
          $scope.error = 'There was an error while saving segment';
          $log.info("failure");
        });
      };

      $scope.$on("mics-query-tool:save-complete", function (event, params) {
        saveSegment(params.queryId);
      });

      $scope.$on("mics-query-tool:save-error", function (event, params) {
        if (params.reason.data && params.reason.data.error_id){
          $scope.error = 'There was an error while saving query, errorId: ' + params.reason.data.error_id;
        } else {
          $scope.error = 'There was an error while saving query';
        }
      });

      $scope.activations = [];
      $scope.goals = [];

      $scope.$on("mics-audience-segment:activation-added", function (event, activation) {
        if ($scope.activations.indexOf(activation) === -1){
          $scope.activations.push(activation);
        }
      });

      $scope.$on("mics-audience-segment:goal-selected", function (event, selectedGoal) {
        var existingGoal = !!_.find($scope.goals, function(goal){
          return goal.id === selectedGoal.id;
        });

        if (!existingGoal){
          $scope.goals.push(selectedGoal);
        }
      });


      $scope.addActivation = function () {
        var newScope = $scope.$new(true);
        newScope.activation = {};
        $uibModal.open({
            templateUrl: 'src/core/datamart/segments/add-activation.html',
            scope : newScope,
            backdrop : 'static',
            controller: 'core/datamart/segments/AddActivationController'
          });
      };

      $scope.editActivation = function (activation) {
        var newScope = $scope.$new(true);
        newScope.activation = activation;
        $uibModal.open({
          templateUrl: 'src/core/datamart/segments/add-activation.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/datamart/segments/AddActivationController',
          size: "lg"
        });
      };

      $scope.addGoal = function () {
        var newScope = $scope.$new(true);
        $uibModal.open({
          templateUrl: 'src/core/datamart/segments/ChooseExistingGoal.html',
          scope: newScope,
          backdrop: 'static',
          controller: 'core/datamart/segments/ChooseExistingGoalController',
          size: 'lg'
        });
      };

      $scope.removeGoal = function (goal) {
        var i = $scope.goals.indexOf(goal);
        $scope.goals.splice(i,1);
      };

      $scope.removeActivation = function (activation) {
        var i = $scope.activations.indexOf(activation);
        $scope.activations.splice(i,1);
      };

      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/datamart/segments");
      };

      $scope.next = function () {
        if (type === 'USER_QUERY'){
          $scope.$broadcast("mics-query-tool:save");
        } else {
          saveSegment();
        }
      };

      $scope.refreshQuery = function () {
        $scope.$broadcast("mics-query-tool:refresh");
      };
    }
  ]);
});
