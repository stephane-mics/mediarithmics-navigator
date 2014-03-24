(function () {
  'use strict';

  var module = angular.module('core/campaigns');

  /*
   * Campaign list controller
   */
  module.controller('core/campaigns/ListController', [
    '$scope', '$location', '$log', 'Restangular', 'core/campaigns/DisplayCampaignService',
    function($scope, $location, $log, Restangular, DisplayCampaignService) {

      Restangular.all('campaigns').getList({organisation_id:2}).then(function (campaigns) {
        $scope.campaigns = campaigns;
      });

      $scope.newCampaign = function() {
        $location.path('/display-campaigns/select-campaign-template');
      };

      $scope.editCampaign = function(campaign) {

        $log.debug("> editCampaign for campaignId=", campaign.id);

        // get campaign edit template
        var editTemplateView = '/display-campaigns/expert/edit-campaign/';
        DisplayCampaignService.initEditCampaign(campaign.id).then(function(){
          $location.path(editTemplateView + campaign.id);
        });


      };
    }
  ]);

})();
