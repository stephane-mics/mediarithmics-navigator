define(['./module'], function (module) {
  'use strict';

  module.controller('core/datamart/segments/ChooseExistingAudienceSegmentsPopingController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $scope.segments = Restangular.all("audience_segments").getList({
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedSegments = [];

      $scope.done = function() {

        var segment;
        for (var i = 0; i < $scope.selectedSegments.length; i++) {
          segment = $scope.selectedSegments[i];
          $scope.$emit("mics-user-group:selected", {
            segment : segment,
            exclude : segment.exclude // TODO use a wrapper ?
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

