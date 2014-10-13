define(['./module'], function () {
  'use strict';

  var module = angular.module('core/adgroups');

  module.controller('core/adgroups/ChooseExistingAdsController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {
      $scope.currentPageDisplayCampaign = 1;
      $scope.itemsPerPage = 10;

      $scope.availableCreatives = Restangular.all("creatives").getList({
        creative_type : "DISPLAY_AD",
        archived : false,
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedCreatives = [];

      $scope.done = function() {
        var creative;
        for (var i = 0; i < $scope.selectedCreatives.length; i++) {
          creative = $scope.selectedCreatives[i];
          $scope.$emit("mics-creative:selected", {
            creative : creative
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

