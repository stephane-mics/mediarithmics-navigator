define(['./module'], function () {
  'use strict';

  var module = angular.module('core/placementlists');

  module.controller('core/placementlists/ChooseExistingPlacementListController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $scope.availablePlacementLists = Restangular.all("placement_lists").getList({
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedPlacementLists = [];

      $scope.done = function() {
        var placementList;
        for (var i = 0; i < $scope.selectedPlacementLists.length; i++) {
          placementList = $scope.selectedPlacementLists[i];
          $scope.$emit("mics-placement-list:selected", {
            placementList : placementList
          });
        }
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});


