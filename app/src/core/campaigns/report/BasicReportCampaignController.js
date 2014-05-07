/* global _ */
(function () {
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

  var updateStatistics = function ($scope, CampaignAnalyticsReportService, $routeParams) {

    var startDate = $scope.reportDateRange.startDate;
    var endDate = $scope.reportDateRange.endDate;
    var campaignId = $routeParams.campaign_id;

    $scope.xaxisdomain = [startDate.toDate().getTime(),
      endDate.toDate().getTime()
    ];

    CampaignAnalyticsReportService.dayPerformance(
      startDate,
      endDate,
      campaignId,
      "clicks", "impressions"
    ).then(function (data) {
        $scope.data1 = data;
      });
    CampaignAnalyticsReportService.adGroupPerformance(
      startDate,
      endDate,
      campaignId
    ).then(function (data) {
        $scope.adGroupPerformance = data;
      });
    CampaignAnalyticsReportService.creativePerformance(
      startDate,
      endDate,
      campaignId
    ).then(function (data) {
        $scope.creativePerformance = data;
      });
    CampaignAnalyticsReportService.adPerformance(
      startDate,
      endDate,
      campaignId
    ).then(function (data) {
        $scope.adPerformance = data;
      });
    CampaignAnalyticsReportService.kpi(
      startDate,
      endDate,
      campaignId
    ).then(function (data) {
        $scope.kpis = data;
      });


  };

  /*
   * Campaign list controller
   */
  module.controller('core/campaigns/report/BasicReportCampaignController', [
    '$scope', '$location', '$log', '$routeParams', 'Restangular', 'd3', 'moment', 'core/campaigns/DisplayCampaignService', 'CampaignAnalyticsReportService',
    function ($scope, $location, $log, $routeParams, Restangular, d3, moment, DisplayCampaignService, CampaignAnalyticsReportService) {
      $scope.valTo = 10;
      $log.debug("fetching " + $routeParams.campaign_id);
      DisplayCampaignService.getDeepCampaignView($routeParams.campaign_id).then(function (campaign) {
        $scope.campaign = campaign;
        $scope.adgroups = campaign.ad_groups;
        $scope.ads = _.unique(_.flatten(_.map(campaign.ad_groups, "ads")), "creative_id");


        $scope.reportDateRange = {startDate: moment().subtract('days', 20), endDate: moment()};


        $scope.$watch('reportDateRange', function () {
          updateStatistics($scope, CampaignAnalyticsReportService, $routeParams);
        });
        $scope.refresh = function () {
          updateStatistics($scope, CampaignAnalyticsReportService, $routeParams);
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
        Restangular.one("campaigns", campaign.id).customPUT({
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

        // get campaign edit template
        var editTemplateView = '/display-campaigns/expert/edit/';
//        DisplayCampaignService.initEditCampaign(campaign.id).then(function () {
        $location.path(editTemplateView + campaign.id);
//        });


      };
    }
  ]);

})();
