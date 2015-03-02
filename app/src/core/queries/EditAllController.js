define(['./module'], function () {

  'use strict';

  var module = angular.module('core/queries');

  module.controller('core/queries/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal',
    function($scope, Restangular, Session, $location, $modal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('queries').getList({organisation_id: organisationId}).then(function (queries) {
        $scope.queries = queries;
      });

      $scope.createQuery = function (type) {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/queries/");
      };

      $scope.editQuery = function (scenario, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/queries/"+ scenario.id);
      };

      $scope.deleteQuery = function (scenario, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        var newScope = $scope.$new(true);
        newScope.scenario = scenario;
        $modal.open({
          templateUrl: 'src/core/queries/delete.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/queries/DeleteController'
        });

        return false;
      };
    }
  ]);

});


