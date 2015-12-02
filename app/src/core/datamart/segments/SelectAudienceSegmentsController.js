define(['./module'], function (module) {

  'use strict';

  module.controller("core/datamart/segments/SelectAudienceSegmentsController", [
    "$scope", "$uibModal", "$log",
    function($scope, $uibModal, $log) {

      $scope.selectExistingAudienceSegments = function() {
        // display pop-up
        var uploadModal = $uibModal.open({
          templateUrl: 'src/core/datamart/segments/ChooseExistingAudienceSegmentsPopin.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/datamart/segments/ChooseExistingAudienceSegmentsPopinController',
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
