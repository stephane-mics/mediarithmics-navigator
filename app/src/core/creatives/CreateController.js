define(['./module.js'], function () {
  'use strict';

  var module = angular.module('core/creatives');

  /*
   * Campaign
   */

  module.controller('core/creatives/CreateController', [
    '$scope', '$location', '$log', 'core/common/auth/Session','core/creatives/CreativeTemplateService',

    function($scope, $location, $log, Session, CreativeTemplateService) {

      // load creative templates


      // create button
      $scope.create = function(template) {

        var createTemplateView = '/campaigns/display/expert/edit-campaign/';
        var organisationId = Session.getCurrentWorkspace().organisation_id;

       /* 
        DisplayCampaignService.initCreateCampaign(template, organisationId).then(function(campaignId){
          $log.debug("campaign init , campaign_id = ", campaignId);
          $location.path(createTemplateView + campaignId);
        });
        */
        
      };

      $scope.cancel = function() {
        $location.path('/creatives');
      };

    }
  ]);

});
