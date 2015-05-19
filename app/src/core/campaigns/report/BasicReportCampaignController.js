/* global _, moment */
define(['./module'], function (module) {
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

  var updateStatistics = function ($scope, CampaignAnalyticsReportService, $stateParams) {
    CampaignAnalyticsReportService.setDateRange($scope.reportDateRange);

    var campaignId = $stateParams.campaign_id;

    $scope.xaxisdomain = [CampaignAnalyticsReportService.getStartDate().toDate().getTime(),
      CampaignAnalyticsReportService.getEndDate().toDate().getTime()
    ];

    CampaignAnalyticsReportService.dayPerformance(
      campaignId,
      "clicks", "impressions"
    ).then(function (data) {
        $scope.data1 = data;
      });


    CampaignAnalyticsReportService.adGroupPerformance(
      campaignId
    ).then(function (data) {
        $scope.adGroupPerformance = data;
      });

    /*
    CampaignAnalyticsReportService.creativePerformance(
      campaignId
    ).then(function (data) {
        $scope.creativePerformance = data;
      });
    */
    CampaignAnalyticsReportService.adPerformance(
      campaignId
    ).then(function (data) {
        $scope.adPerformance = data;
      });

    CampaignAnalyticsReportService.mediaPerformance(
      campaignId
    ).then(function (data) {
        $scope.mediaPerformance = data;
      });

    CampaignAnalyticsReportService.kpi(
      campaignId
    ).then(function (data) {
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

      $log.debug("fetching " + $stateParams.campaign_id);
      DisplayCampaignService.getDeepCampaignView($stateParams.campaign_id).then(function (campaign) {
        $scope.campaign = campaign;
        $scope.adgroups = campaign.ad_groups;

        // bastard object to iterate easily with an ng-repeat
        $scope.adsWithGroup = [];
        _.forEach(campaign.ad_groups, function (ad_group) {
          _.forEach(ad_group.ads, function (ad) {
            $scope.adsWithGroup.push({
              ad_group: ad_group,
              ad: ad
            });
          });
        });

        $scope.getUrlForCreative = function (ad) {
          var type = "display-ad";
          if (ad.creative_editor_group_id === "com.mediarithmics.creative.video") {
            type = "video-ad";
          }
          return "/" + Session.getCurrentWorkspace().organisation_id + "/creatives/" + type + "/" + ad.creative_editor_artifact_id + "/edit/" + ad.creative_id;
        };

        $scope.$watch('reportDateRange', function () {
          updateStatistics($scope, CampaignAnalyticsReportService, $stateParams);
        });

        $scope.refresh = function () {
          updateStatistics($scope, CampaignAnalyticsReportService, $stateParams);
        };
      });


      $scope.getDataForRow = getDataForRow;

      $scope.xAxisTickFormat = function () {
        return function (d) {
          return d3.time.format('%d %b')(new Date(d)); //uncomment for date format
        };
      };
      $scope.yAxisTickFormat = function () {
        return function (d) {
          return d3.format(',f');
        };
      };
      $scope.y2AxisTickFormat = function () {
        return function (d) {
          return '$' + d3.format(',.2f')(d);
        };
      };


      $scope.editCampaign = function (campaign) {

        $log.debug("> editCampaign for campaignId=", campaign.id);

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
