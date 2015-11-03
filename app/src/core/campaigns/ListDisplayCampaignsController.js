define(['./module'], function (module) {
  'use strict';

  var updateStatistics = function ($scope, CampaignAnalyticsReportService, organisationId) {
    CampaignAnalyticsReportService.setDateRange($scope.reportDateRange);
    // Moment is not immutable
    var report = CampaignAnalyticsReportService.allCampaigns(organisationId);
    report.then(function (stats) {
      $scope.displayCampaignsStatistics = stats;
    });
  };

  /**
   * Campaign list controller
   */
  module.controller('core/campaigns/ListDisplayCampaignsController', [
    '$scope', '$location', '$modal', '$log', 'Restangular', 'd3', 'moment', 'core/campaigns/DisplayCampaignService', 'core/common/auth/Session',
    'CampaignAnalyticsReportService', 'core/campaigns/CampaignPluginService', 'core/common/files/ExportService',
    function ($scope, $location, $modal, $log, Restangular, d3, moment, DisplayCampaignService, Session, CampaignAnalyticsReportService, CampaignPluginService, ExportService) {
      var currentWorkspace = Session.getCurrentWorkspace();

      $scope.currentPageDisplayCampaign = 1;
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

      $scope.$watch('reportDateRange', function () {
        updateStatistics($scope, CampaignAnalyticsReportService, currentWorkspace.organisation_id);
      });

      $scope.refresh = function () {
        updateStatistics($scope, CampaignAnalyticsReportService, currentWorkspace.organisation_id);
      };

      // load display campaign templates
      CampaignPluginService.getAllDisplayCampaignEditors().then(function (templates) {
        $scope.campaignTemplates = templates;
      });

      // create button
      $scope.create = function (template) {
        var organisationId = Session.getCurrentWorkspace().organisation_id;
        DisplayCampaignService.reset();
        DisplayCampaignService.initCreateCampaign(template, organisationId).then(function (campaignId) {
          var location = template.editor.create_path.replace(/{id}/g, campaignId).replace(/{organisation_id}/, organisationId);
          $log.debug("campaign init , campaign_id = ", campaignId);
          $location.path(location);
        });
      };

      var buildAllCampaignsExportHeaders = function (report) {
        var headers = ["Status", "Name"];
        if ($scope.administrator) {
          headers = headers.concat("Organisation");
        }
        var metrics = report.getMetrics();
        // TODO get metrics with formatted names
        for (var i = 0; i < metrics.length; ++i) {
          headers = headers.concat(report.getMetricName(metrics[i]));
        }
        return headers;
      };

      $scope.buildAllCampaignsExportData = function () {
        return CampaignAnalyticsReportService.allCampaigns().then(function (report) {
          var dataExport = [
            ["All Campaigns"],
            ["From " + $scope.reportDateRange.startDate.format("DD-MM-YYYY"), "To " + $scope.reportDateRange.endDate.format("DD-MM-YYYY")],
            [],
            buildAllCampaignsExportHeaders(report)
          ];
          for (var i = 0; i < $scope.displayCampaigns.length; ++i) {
            var campaign = $scope.displayCampaigns[i];
            var row = [campaign.status, campaign.name];
            if ($scope.administrator) {
              row.push($scope.organisationName($scope.organisation_id));
            }
            var campaignMetrics = report.getRow(campaign.id);
            for (var j = 0; j < campaignMetrics.length; ++j) {
              row.push(campaignMetrics[j].value || '');
            }
            row = row.concat();
            dataExport = dataExport.concat([row]);
          }
          return dataExport;
        });
      };

      $scope.export = function (extension) {
        $scope.buildAllCampaignsExportData().then(function (dataExport) {
          ExportService.exportData([{
            name: "All Campaigns",
            data: dataExport
          }], 'AllCampaigns-' + currentWorkspace.organisation_id, extension);
        });
      };

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

        CampaignPluginService.getCampaignEditorFromVersionId(campaign.editor_version_id).then(function (template) {
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
