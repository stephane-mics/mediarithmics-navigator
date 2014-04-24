(function () {
  'use strict';

  var module = angular.module('core/campaigns');

  var updateStatistics = function ($scope, CampaignAnalyticsReportService, organisationId) {
    var startDate = $scope.reportDateRange.startDate;
    var endDate = $scope.reportDateRange.endDate;
    var report = CampaignAnalyticsReportService.allCampaigns(startDate, endDate, organisationId);
    report.then(function (stats) {
      $scope.campaignsStatistics = stats;
    })


  }
  /*
   * Campaign list controller
   */
  module.controller('core/campaigns/ListController', [
    '$scope', '$location', '$log', 'Restangular', 'd3', 'moment', 'core/campaigns/DisplayCampaignService', 'core/common/auth/Session','CampaignAnalyticsReportService',
    function ($scope, $location, $log, Restangular, d3, moment, DisplayCampaignService, Session, CampaignAnalyticsReportService) {

      $scope.reportDateRange = {startDate: moment().subtract('days', 20), endDate: moment()};



      Restangular.all('campaigns').getList({organisation_id: Session.getCurrentWorkspace().organisation_id}).then(function (campaigns) {
        $scope.campaigns = campaigns;
        $scope.$watch('reportDateRange', function () {
          updateStatistics($scope, CampaignAnalyticsReportService,  Session.getCurrentWorkspace().organisation_id)
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
        var editTemplateView = '/display-campaigns/expert/edit-campaign/';
        DisplayCampaignService.initEditCampaign(campaign.id).then(function () {
          $location.path(editTemplateView + campaign.id);
        });


      };
    }
  ]);

})();
