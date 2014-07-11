define(['./module'], function () {

  'use strict';

  var module = angular.module('core/placementlists');

  module.controller('core/placementlists/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal',
    function($scope, Restangular, Session, $location, $modal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('placement_lists').getList({organisation_id: organisationId}).then(function (placementLists) {
        $scope.placementLists = placementLists;
      });

      $scope.createPlacementList = function (type) {
        $location.path("/library/placementlists/" + type);
      };

      $scope.editPlacementList = function (placementList, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path("/library/placementlists/" + placementList.group_type + "/" + placementList.id);
      };

      $scope.deletePlacementList = function (placementList, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        var newScope = $scope.$new(true);
        newScope.placementList = placementList;
        $modal.open({
          templateUrl: 'src/core/placementlists/delete.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/placementlists/DeleteController'
        });

        return false;
      };
    }
  ]);

});


