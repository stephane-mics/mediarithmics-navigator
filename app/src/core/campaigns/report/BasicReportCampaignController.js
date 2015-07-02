define(['./module', 'lodash'], function (module, _) {
  'use strict';

  var getDataForRow = function (id, stats) {
    if (stats === undefined) {
      return;
    }
    var statRow = _.filter(stats.rows, function (row) {
      return row[0] === id;
    })[0];

    var isMetrics = function (e) {
      return !(/name|id/).test(e);
    };

    var notMetrics = function (e) {
      return (/name|id/).test(e);
    };

    if (statRow === undefined) {
      return _.map(_.range(_.filter(stats.columns_headers, isMetrics).length), function () {
        return "-";
      });
    }

    return _.rest(statRow, _.findLastIndex(stats.columns_headers, notMetrics) + 1);
  };

  var updateChartsStatistics = function ($scope, campaignId, CampaignAnalyticsReportService, ChartsService, charts) {
    var leftMetric = charts[0];
    var rightMetric = charts[1];

    // Get statistics according to time filter
    if ($scope.timeFilter === $scope.timeFilters[1]) {
      CampaignAnalyticsReportService.hourlyPerformance(campaignId, leftMetric, rightMetric)
        .then(function (data) {
          $scope.chartData = data;
        });
    } else {
      CampaignAnalyticsReportService.dailyPerformance(campaignId, leftMetric, rightMetric)
        .then(function (data) {
          $scope.chartData = data;
        });
    }
  };

  var updateStatistics = function ($scope, campaignId, CampaignAnalyticsReportService, ChartsService, charts) {
    CampaignAnalyticsReportService.setDateRange($scope.reportDateRange);
    if (CampaignAnalyticsReportService.dateRangeIsToday()) {
      $scope.timeFilter = $scope.timeFilters[1];
    }

    $scope.xaxisdomain = [CampaignAnalyticsReportService.getStartDate().toDate().getTime(),
      CampaignAnalyticsReportService.getEndDate().toDate().getTime()
    ];

    updateChartsStatistics($scope, campaignId, CampaignAnalyticsReportService, ChartsService, charts);

    CampaignAnalyticsReportService.adGroupPerformance(campaignId)
      .then(function (data) {
        $scope.adGroupPerformance = data;
      });

    CampaignAnalyticsReportService.adPerformance(campaignId)
      .then(function (data) {
        $scope.adPerformance = data;
      });

    CampaignAnalyticsReportService.mediaPerformance(campaignId)
      .then(function (data) {
        $scope.mediaPerformance = data;
      });

    CampaignAnalyticsReportService.kpi(campaignId)
      .then(function (data) {
        $scope.kpis = data;
      });
  };

  /**
   * Campaign list controller
   */
  module.controller('core/campaigns/report/BasicReportCampaignController', [
    '$scope', '$location', '$modal', '$log', '$stateParams', 'core/campaigns/report/ChartsService', 'core/campaigns/DisplayCampaignService', 'CampaignAnalyticsReportService', 'core/campaigns/CampaignPluginService', 'core/common/auth/Session',
    function ($scope, $location,  $modal,  $log, $stateParams, ChartsService, DisplayCampaignService, CampaignAnalyticsReportService, CampaignPluginService, Session) {
      $scope.reportDateRange = CampaignAnalyticsReportService.getDateRange();
      $scope.reportDefaultDateRanges = CampaignAnalyticsReportService.getDefaultDateRanges();
      $scope.timeFilters = ['Daily', 'Hourly']; // Time filters order is important
      $scope.timeFilter = $scope.timeFilters[0];
      $scope.chartArea = "chart-area";
      $scope.charts = ['clicks', 'impressions'];
      $scope.getChartName = ChartsService.getChartName;

      DisplayCampaignService.getDeepCampaignView($stateParams.campaign_id).then(function (campaign) {
        $scope.campaign = campaign;
        $scope.adgroups = campaign.ad_groups;

        // Object used to iterate easily with an ng-repeat
        $scope.adsWithGroup = [];
        _.forEach(campaign.ad_groups, function (ad_group) {
          _.forEach(ad_group.ads, function (ad) {
            $scope.adsWithGroup.push({
              ad_group: ad_group,
              ad: ad
            });
          });
        });

        $scope.isHourlyMode = function () {
          return $scope.timeFilter === $scope.timeFilters[1];
        };

        $scope.getUrlForCreative = function (ad) {
          var type = "display-ad";
          if (ad.creative_editor_group_id === "com.mediarithmics.creative.video") {
            type = "video-ad";
          }
          return "/" + Session.getCurrentWorkspace().organisation_id + "/creatives/" + type + "/" + ad.creative_editor_artifact_id + "/edit/" + ad.creative_id;
        };

        $scope.$watch('reportDateRange', function () {
          $scope.timeFilter = $scope.timeFilters[0];
          updateStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService, ChartsService, $scope.charts);
        });

        $scope.refresh = function () {
          updateStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService, ChartsService, $scope.charts);
        };
      });

      /**
       * Utils
       */

      $scope.showDetails = function () {
        $scope.details = !$scope.details;
        if ($scope.chartArea === "chart-area")
          $scope.chartArea = "chart-area show-details";
        else
          $scope.chartArea = "chart-area";
        updateChartsStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService, ChartsService, $scope.charts);
      };

      $scope.dateRangeIsToday = function () {
        return CampaignAnalyticsReportService.dateRangeIsToday();
      };

      $scope.getDataForRow = getDataForRow;

      $scope.chooseCharts = function () {
        var modalInstance = $modal.open({
          templateUrl: 'src/core/campaigns/report/ChooseCharts.html',
          scope: $scope,
          backdrop: 'static',
          controller: 'core/campaigns/report/ChooseChartsController',
          size: 'lg',
          resolve: {
            charts: function () {
              return $scope.charts;
            }
          }
        });

        modalInstance.result.then(function (charts) {
          $scope.charts = charts;
          updateChartsStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService, ChartsService, charts);
        })
      };

      /**
       * Campaigns Management
       */

      $scope.editCampaign = function (campaign) {
        CampaignPluginService.getCampaignTemplate(campaign.template_group_id, campaign.template_artifact_id).then(function (template) {
          var location = template.editor.edit_path.replace(/{id}/g, campaign.id).replace(/{organisation_id}/, campaign.organisation_id);
          $location.path(location);
        });
      };

      $scope.deleteCampaign = function (campaign) {
        var newScope = $scope.$new(true);
        newScope.campaign = campaign;
        $modal.open({
          templateUrl: 'src/core/campaigns/delete.html',
          scope: newScope,
          backdrop: 'static',
          controller: 'core/campaigns/DeleteController'
        });
      };
    }
  ]);
});
