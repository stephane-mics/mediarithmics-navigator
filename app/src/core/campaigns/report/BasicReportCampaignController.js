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

  var updateStatistics = function ($scope, campaignId, CampaignAnalyticsReportService) {
    CampaignAnalyticsReportService.setDateRange($scope.reportDateRange);
    if (CampaignAnalyticsReportService.dateRangeIsToday()) {
      $scope.timeFilter = $scope.timeFilters[1];
    }

    $scope.xaxisdomain = [CampaignAnalyticsReportService.getStartDate().toDate().getTime(),
      CampaignAnalyticsReportService.getEndDate().toDate().getTime()
    ];

    // Get statistics according to time filter
    if ($scope.timeFilter === $scope.timeFilters[1]) {
      CampaignAnalyticsReportService.hourlyPerformance(campaignId, "clicks", "impressions")
        .then(function (data) {
          $scope.chartData = data;
        });
    } else {
      CampaignAnalyticsReportService.dailyPerformance(campaignId, "clicks", "impressions")
        .then(function (data) {
          $scope.chartData = data;
        });
    }

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
    '$scope', '$location', '$log', '$stateParams', 'Restangular', 'd3', 'moment', 'core/campaigns/DisplayCampaignService', 'CampaignAnalyticsReportService', 'core/campaigns/CampaignPluginService', '$modal', 'core/common/auth/Session',
    function ($scope, $location, $log, $stateParams, Restangular, d3, moment, DisplayCampaignService, CampaignAnalyticsReportService, CampaignPluginService, $modal, Session) {
      $scope.valTo = 10;
      $scope.reportDateRange = CampaignAnalyticsReportService.getDateRange();
      $scope.reportDefaultDateRanges = CampaignAnalyticsReportService.getDefaultDateRanges();
      $scope.timeFilters = ['Daily', 'Hourly']; // Time filters order is important
      $scope.timeFilter = $scope.timeFilters[0];

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

        $scope.isHourlyMode = function() {
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
          updateStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService);
        });

        $scope.refresh = function () {
          updateStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService);
        };
      });

      /**
       * Utils
       */

      $scope.dateRangeIsToday = function () {
        return CampaignAnalyticsReportService.dateRangeIsToday();
      };

      $scope.getDataForRow = getDataForRow;

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
