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

      $scope.$on("mics-query-tool:save-complete", function (event, params) {
        var promise = null;
        if(segmentId) {
          promise = $scope.segment.put();
        } else {
          $scope.segment.query_id = params.queryId;
          promise = Restangular.all('audience_segments').post($scope.segment, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        }
        promise.then(function success(){
          $log.info("success");
          $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/datamart/segments");
        }, function failure(){
          $scope.error = 'There was an error while saving segment';
          $log.info("failure");
        });
      });
      $scope.$on("mics-query-tool:save-error", function (event, params) {
        if (params.reason.data && params.reason.data.error_id){
          $scope.error = 'There was an error while saving query, errorId: ' + params.reason.data.error_id;
        } else {
          $scope.error = 'There was an error while saving query';
        }
      });

      $scope.activations = [];

      $scope.$on("mics-audience-segment:activation-added", function (event, params) {
        if ($scope.activations.indexOf(params.activation) === -1){
          $scope.activations.push(params.activation);
        }
      });


      $scope.addActivation = function () {
        var newScope = $scope.$new(true);
        newScope.activation = {};
        $uibModal.open({
            templateUrl: 'src/core/datamart/segments/add-activation.html',
            scope : newScope,
            backdrop : 'static',
            controller: 'core/datamart/segments/AddActivationController',
            size: "lg"
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

      $scope.removeActivation = function (activation) {
        var i = $scope.activations.indexOf(activation);
        $scope.activations.splice(i,1);
      };

      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/datamart/segments");
      };

      $scope.next = function () {
        $scope.$broadcast("mics-query-tool:save");
      };

      $scope.refreshQuery = function () {
        $scope.$broadcast("mics-query-tool:refresh");
      };
    }
  ]);
});
