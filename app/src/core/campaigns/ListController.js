(function () {
  'use strict';

  var module = angular.module('core/campaigns');

  var updateStatistics = function ($scope, CampaignAnalyticsReportService, organisationId) {
    CampaignAnalyticsReportService.setDateRange($scope.reportDateRange);
    //Moment is not immutable
    var report = CampaignAnalyticsReportService.allCampaigns(organisationId);
    report.then(function (stats) {
      $scope.campaignsStatistics = stats;
    });


  };
  /*
   * Campaign list controller
   */
  module.controller('core/campaigns/ListController', [
    '$scope', '$location', '$log', 'Restangular', 'd3', 'moment', 'core/campaigns/DisplayCampaignService', 'core/common/auth/Session','CampaignAnalyticsReportService',
    function ($scope, $location, $log, Restangular, d3, moment, DisplayCampaignService, Session, CampaignAnalyticsReportService) {

      $scope.reportDateRange = CampaignAnalyticsReportService.getDateRange();
      $scope.organisationName = function (id ){ return Session.getOrganisationName(id);};

      $scope.administrator = Session.getCurrentWorkspace().administrator;

      var params = { organisation_id: Session.getCurrentWorkspace().organisation_id };
      if (Session.getCurrentWorkspace().administrator) {
        params = { administration_id: Session.getCurrentWorkspace().organisation_id };
      }
      Restangular.all('campaigns').getList(params).then(function (campaigns) {
        $scope.campaigns = campaigns;
        $scope.$watch('reportDateRange', function () {
          updateStatistics($scope, CampaignAnalyticsReportService,  Session.getCurrentWorkspace().organisation_id);
        });
      });

      $scope.newCampaign = function () {
        $location.path('/display-campaigns/select-campaign-template');
      };

      $scope.showCampaign = function (campaign) {
        $log.debug("> showCampaign for campaignId=", campaign.id);
        $location.path("/display-campaigns/report/" + campaign.id + "/basic");

      };

      $scope.editCampaign = function (campaign) {

        $log.debug("> editCampaign for campaignId=", campaign.id);

        // get campaign edit template
        var editTemplateView = 'display-campaigns/expert/edit/';
        DisplayCampaignService.initEditCampaign(campaign.id).then(function () {
          $location.path(editTemplateView + campaign.id);
        });


      };
    }
  ]);

})();
