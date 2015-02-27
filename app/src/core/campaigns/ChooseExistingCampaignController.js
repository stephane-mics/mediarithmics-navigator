define(['./module'], function (module) {
  'use strict';

  module.controller('core/campaigns/ChooseExistingCampaignController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      var params = { organisation_id: Session.getCurrentWorkspace().organisation_id };
      Restangular.all('campaigns').getList(params).then(function (campaigns) {
          $scope.availableCampaigns = campaigns;
      });


      $scope.choose = function(campaign) {
              $scope.$emit("mics-campaign:selected", campaign);
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});


