define(['./module'], function (module) {

  'use strict';

  module.controller("core/scenarios/ChooseScenariosController", [
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {

      $scope.selectExistingScenarios = function() {
        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/scenarios/ChooseExistingScenarios.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/scenarios/ChooseExistingScenariosController',
          size: "lg"
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    }
  ]);
});
