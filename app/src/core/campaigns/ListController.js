define(['./module'], function (module) {
  'use strict';

  var updateStatistics = function ($scope, CampaignAnalyticsReportService, organisationId) {
    CampaignAnalyticsReportService.setDateRange($scope.reportDateRange);
    //Moment is not immutable
    var report = CampaignAnalyticsReportService.allCampaigns(organisationId);
    report.then(function (stats) {
      $scope.displayCampaignsStatistics = stats;
    });
  };

  /**
   * Campaign list controller
   */
  module.controller('core/campaigns/ListController', [
    '$scope', '$location', '$log', 'Restangular', 'd3', 'moment', 'core/campaigns/DisplayCampaignService', 'core/common/auth/Session', 'CampaignAnalyticsReportService', 'core/campaigns/CampaignPluginService', '$modal',
    function ($scope, $location, $log, Restangular, d3, moment, DisplayCampaignService, Session, CampaignAnalyticsReportService, CampaignPluginService, $modal) {
      var currentWorkspace = Session.getCurrentWorkspace();

      $scope.currentPageDisplayCampaign = 1;
      $scope.currentPageEmailCampaign = 1;
      $scope.itemsPerPage = 10;

      $scope.reportDateRange = CampaignAnalyticsReportService.getDateRange();
      $scope.reportDefaultDateRanges = CampaignAnalyticsReportService.getDefaultDateRanges();
      $scope.organisationName = function (id) {
        return Session.getOrganisationName(id);
      };

      $scope.administrator = currentWorkspace.administrator;

      var params = {organisation_id: currentWorkspace.organisation_id};
      if ($scope.administrator) {
        params = {administration_id: currentWorkspace.organisation_id};
      }
      Restangular.all('display_campaigns').getList(params).then(function (displayCampaigns) {
        $scope.displayCampaigns = displayCampaigns;
      });
      Restangular.all('email_campaigns').getList(params).then(function (emailCampaigns) {
        $scope.emailCampaigns = emailCampaigns;
      });
      $scope.$watch('reportDateRange', function () {
        updateStatistics($scope, CampaignAnalyticsReportService, currentWorkspace.organisation_id);
      });

      $scope.getCampaignDashboardUrl = function (campaign) {
        return "/" + campaign.organisation_id + "/campaigns/" + campaign.type.toLowerCase() + "/report/" + campaign.id + "/basic";
      };

      $scope.newCampaign = function () {
        $location.path('/' + currentWorkspace.organisation_id + '/campaigns/select-campaign-template');
      };

      $scope.showCampaign = function (campaign, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path($scope.getCampaignDashboardUrl(campaign));
      };

      $scope.editCampaign = function (campaign, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        CampaignPluginService.getCampaignTemplate(campaign.template_group_id, campaign.template_artifact_id).then(function (template) {
          var location = template.editor.edit_path.replace(/{id}/g, campaign.id).replace(/{organisation_id}/, campaign.organisation_id);
          $location.path(location);
        });
        return false;
      };

      $scope.deleteCampaign = function (campaign, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }
        var newScope = $scope.$new(true);
        newScope.campaign = campaign;
        $modal.open({
          templateUrl: 'src/core/campaigns/delete.html',
          scope: newScope,
          backdrop: 'static',
          controller: 'core/campaigns/DeleteController'
        });

        return false;
      };
    }
  ]);

});
