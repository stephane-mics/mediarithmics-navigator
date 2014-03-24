(function () {
  'use strict';

  var module = angular.module('core/campaigns');

  /*
   * Campaign
   */
  module.controller('core/campaigns/CreateController', [
    '$scope', '$location', '$log', 'core/common/auth/Session','core/campaigns/DisplayCampaignService',

    function($scope, $location, $log, Session, DisplayCampaignService) {

      // load display campaign templates


      // create button
      $scope.create = function(template) {

        var createTemplateView = '/display-campaigns/expert/edit-campaign/';
        var organisationId = Session.getCurrentWorkspace().organisation_id;

        DisplayCampaignService.initCreateCampaign(template, organisationId).then(function(campaignId){
          $log.debug("campaign init , campaign_id = ", campaignId);
          $location.path(createTemplateView + campaignId);
        });

      };

      $scope.cancel = function() {
        $location.path('/display-campaigns');
      };

    }
  ]);

})();
