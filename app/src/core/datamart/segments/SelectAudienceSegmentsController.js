define(['./module'], function (module) {

  'use strict';

  module.controller("core/datamart/segments/SelectAudienceSegmentsController", [
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {

      $scope.selectExistingAudienceSegments = function() {
        // display pop-up
        var uploadModal = $modal.open({
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
