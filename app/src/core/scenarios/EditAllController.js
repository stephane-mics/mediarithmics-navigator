define(['./module'], function () {

  'use strict';

  var module = angular.module('core/scenarios');

  module.controller('core/scenarios/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal',
    function($scope, Restangular, Session, $location, $modal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('scenarios').getList({organisation_id: organisationId}).then(function (scenarios) {
        $scope.scenarios = scenarios;
      });

      $scope.createScenario = function (type) {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios/");
      };

      $scope.editScenario = function (scenario, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/scenarios/"+ scenario.id);
      };

      $scope.deleteScenario = function (scenario, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        var newScope = $scope.$new(true);
        newScope.scenario = scenario;
        $modal.open({
          templateUrl: 'src/core/scenarios/delete.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/scenarios/DeleteController'
        });

        return false;
      };
    }
  ]);

});


