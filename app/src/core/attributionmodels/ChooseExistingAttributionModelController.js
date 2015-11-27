define(['./module'], function (module) {
  'use strict';

  module.controller('core/attributionmodels/ChooseExistingAttributionModelController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $scope.availableAttributionModels = Restangular.all("attribution_models").getList({
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedAttributionModel = {
        id : null
      };

      $scope.done = function() {
        var attributionModel;
        for (var i = 0; i < $scope.availableAttributionModels.length; i++) {
          attributionModel = $scope.availableAttributionModels[i];
          if(attributionModel.id === $scope.selectedAttributionModel.id) {
            $scope.$emit("mics-attribution-model:selected", {
              attributionModel : attributionModel
            });
          }
        }
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});


