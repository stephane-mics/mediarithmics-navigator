define(['./module.js'], function () {

  'use strict';

  var module = angular.module('core/placementlists');

  module.controller("core/placementlists/ChoosePlacementListController", [
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {

      $scope.selectExistingPlacementList = function() {
        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/placementlists/ChooseExistingPlacementList.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/placementlists/ChooseExistingPlacementListController'
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    }
  ]);
});

