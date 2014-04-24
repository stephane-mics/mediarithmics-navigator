(function () {
  'use strict';

  var module = angular.module('core/campaigns');

  /*
   * Campaign list controller
   */
  module.controller('core/campaigns/ListController', [
    '$scope', '$location', '$log', 'Restangular', 'core/campaigns/DisplayCampaignService','core/common/auth/Session',
    function($scope, $location, $log, Restangular, DisplayCampaignService, Session) {

     
      Restangular.all('campaigns').getList({organisation_id: Session.getCurrentWorkspace().organisation_id}).then(function (campaigns) {
        $scope.campaigns = campaigns;
      });

      $scope.newCampaign = function() {
        $location.path('/display-campaigns/select-campaign-template');
      };

      $scope.showCampaign = function(campaign) {
        $log.debug("> showCampaign for campaignId=", campaign.id);
        $location.path("/display-campaigns/report/"+campaign.id+"/basic");

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
