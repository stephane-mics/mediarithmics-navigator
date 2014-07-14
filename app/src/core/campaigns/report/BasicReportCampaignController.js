/* global _, moment */
define(['./module'], function () {
  'use strict';

  var module = angular.module('core/campaigns/report');

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
    CampaignAnalyticsReportService.creativePerformance(
      campaignId
    ).then(function (data) {
        $scope.creativePerformance = data;
      });
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

  /*
   * Campaign list controller
   */
  module.controller('core/campaigns/report/BasicReportCampaignController', [
    '$scope', '$location', '$log', '$stateParams', 'Restangular', 'd3', 'moment', 'core/campaigns/DisplayCampaignService', 'CampaignAnalyticsReportService', 'core/campaigns/CampaignPluginService', '$modal',
    function ($scope, $location, $log, $stateParams, Restangular, d3, moment, DisplayCampaignService, CampaignAnalyticsReportService, CampaignPluginService, $modal) {
      $scope.valTo = 10;

      $scope.reportDateRange = CampaignAnalyticsReportService.getDateRange();

      $log.debug("fetching " + $stateParams.campaign_id);
      DisplayCampaignService.getDeepCampaignView($stateParams.campaign_id).then(function (campaign) {
        $scope.campaign = campaign;
        $scope.adgroups = campaign.ad_groups;
        $scope.ads = _.unique(_.flatten(_.map(campaign.ad_groups, "ads")), "creative_id");





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
          return d3.time.format('%d %b')(new Date(d));
        };
      };

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


      var updateCampaignStatus = function (campaign, status) {
        Restangular.one("display_campaigns", campaign.id).customPUT({
          status : status,
          type : "DISPLAY" // XXX this is used server side to find the right subclass of CampaignResource
        }).then(function(returnedCampaign) {
          campaign.status = returnedCampaign.status;
        });
      };

      $scope.activateCampaign = function (campaign) {
        updateCampaignStatus(campaign, "ACTIVE");
      };

      $scope.pauseCampaign = function (campaign) {
        updateCampaignStatus(campaign, "PAUSED");
      };

      $scope.editCampaign = function (campaign) {

        $log.debug("> editCampaign for campaignId=", campaign.id);

        CampaignPluginService.getCampaignTemplate(campaign.template_group_id, campaign.template_artifact_id).then(function (template) {
          var location = template.editor.edit_path.replace(/{id}/g, campaign.id);
          $location.path(location);
        });
      };

      $scope.deleteCampaign = function (campaign) {
        var newScope = $scope.$new(true);
        newScope.campaign = campaign;
        $modal.open({
          templateUrl: 'src/core/campaigns/delete.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/campaigns/DeleteController'
        });
      };
    }
  ]);

});
