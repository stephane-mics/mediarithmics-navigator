define(['./module', 'lodash'], function (module, _) {
  'use strict';

  var updateChartsStatistics = function ($scope, goalId, GoalAnalyticsReportService, ChartsService, charts) {
    var leftMetric = charts[0];
    var rightMetric = charts[1];

    // Get statistics according to time filter
    if ($scope.timeFilter === $scope.timeFilters[1]) {
      GoalAnalyticsReportService.hourlyPerformance(goalId, leftMetric, rightMetric)
        .then(function (data) {
          $scope.chartData = data;
        });
    } else {
      GoalAnalyticsReportService.dailyPerformance(goalId, leftMetric, rightMetric)
        .then(function (data) {
          $scope.chartData = data;
        });
    }
  };

  var updateStatistics = function ($scope, goalId, GoalAnalyticsReportService, ChartsService, charts) {
    GoalAnalyticsReportService.setDateRange($scope.reportDateRange);
    var attributionModels = $scope.attributionModels;


    if (GoalAnalyticsReportService.dateRangeIsToday()) {
      $scope.timeFilter = $scope.timeFilters[1];
    }

    $scope.xaxisdomain = [GoalAnalyticsReportService.getStartDate().toDate().getTime(),
      GoalAnalyticsReportService.getEndDate().toDate().getTime()
    ];

    updateChartsStatistics($scope, goalId, GoalAnalyticsReportService, ChartsService, charts);
    _.forEach(attributionModels, function(attributionModel){
      attributionModel.stats = {};
      var stats = attributionModel.stats;
      
      GoalAnalyticsReportService.attributionKpi(goalId, attributionModel.id).then(function (data) {
        stats.global = data;
      });

      GoalAnalyticsReportService.attributionCampaigns(goalId, attributionModel.id).then(function (data) {
        stats.campaigns = data.transform("interaction_type", true);
      });
      GoalAnalyticsReportService.attributionSources(goalId, attributionModel.id).then(function (data) {
        stats.sources = data.transform("interaction_type",true);
      });
      GoalAnalyticsReportService.attributionCreatives(goalId, attributionModel.id).then(function (data) {
        stats.creatives = data.transform("interaction_type", true);
      });

      return;
    } );



    GoalAnalyticsReportService.kpi(goalId)
      .then(function (data) {
        $scope.kpis = data;
      });
  };

  /**
   * Campaign list controller
   */
  module.controller('core/goals/report/GoalReportController', [
    '$scope', '$location', '$modal', '$log', '$stateParams', 'Restangular', 'core/goals/report/ChartsService',    'GoalAnalyticsReportService',  'core/common/auth/Session', 'core/common/files/ExportService',
    function ($scope, $location, $modal, $log, $stateParams, Restangular, ChartsService,         GoalAnalyticsReportService,  Session, ExportService ) {
      var goalId = $stateParams.goal_id;
      // Chart
      $scope.reportDateRange = GoalAnalyticsReportService.getDateRange();
      $scope.reportDefaultDateRanges = GoalAnalyticsReportService.getDefaultDateRanges();
      $scope.timeFilters = ['Daily', 'Hourly']; // Time filters order is important
      $scope.timeFilter = $scope.timeFilters[0];
      $scope.chartArea = "chart-area";
      $scope.charts = ['value', 'conversions'];
      $scope.getChartName = ChartsService.getChartName;
      // Tabs Set
      var tableHeadersKeys = Object.keys(GoalAnalyticsReportService.getTableHeaders());
      $scope.reverseSort = false;
      $scope.orderBy = "clicks";
      
      Restangular.one("goals", goalId).get().then(function (goal) {
          $scope.goal = goal;

          goal.all("attribution_models").getList().then(function (attributionModels) {
            $scope.attributionModels = attributionModels;
            $scope.defaultAttributionModel = _.find(attributionModels, {'default': true}, 'id').id;
            updateStatistics($scope, $stateParams.goal_id, GoalAnalyticsReportService, ChartsService, $scope.charts);
          } );
          

        });

      

      /**
       * Data Table Export
       */

      var metricsTypes = {
        overview: "Overview",
        ads: "Ads",
        adGroups: "Ad Groups",
        sites: "Sites"
      };

      // TODO Generate Headers Dynamically
      var buildMetricsExportHeaders = function (metricsType) {
        var headers = ["Status", "Name", "Format"];
        if (metricsType === metricsTypes.sites) {
          headers = ["Name"];
        } else if (metricsType === metricsTypes.adGroups) {
          headers = ["Status", "Name"];
        }
        headers = headers.concat(["Imp.", "CPM", "Spent", "Clicks", "CTR", "CPC"]);
        if ($scope.hasCpa) {
          headers.push("CPA");
        }
        return headers;
      };

      var buildExportData = function (metrics, metricsType, header) {
        var data = [];
        for (var i = 0; i < metrics.length; ++i) {
          var row = [metrics[i].status, metrics[i].name, metrics[i].format];
          if (metricsType === metricsTypes.adGroups) {
            row = [metrics[i].status, metrics[i].name];
          } else if (metricsType === metricsTypes.sites) {
            row = [metrics[i].name];
          }
          for (var j = 0; j < metrics[i].info.length; ++j) {
            row.push(metrics[i].info[j].value || '');
          }
          data.push(row);
        }
        return header.concat(data);
      };

      var buildExportOverview = function (header) {
        var metrics = [$scope.kpis.conversions, $scope.kpis.conversion_value];

        
        return header.concat([metrics]).concat($scope.charts).concat($scope.chartData);
      };

      var buildExportHeader = function (metricsType) {
        var metricsHeaders = [];
        if (metricsType === metricsTypes.overview) {
          metricsHeaders = ["Conversions", "Conversion Value"];
        } else {
          metricsHeaders = buildMetricsExportHeaders(metricsType);
        }
        return [
          ["Organisation:", Session.getOrganisationName($scope.goal.organisation_id)],
          ["Goal: ", $scope.goal.name],
          ["From " + $scope.reportDateRange.startDate.format("DD-MM-YYYY"), "To " + $scope.reportDateRange.endDate.format("DD-MM-YYYY")],
          [],
          [metricsType],
          metricsHeaders
        ];
      };

      var buildCampaignMetricsExportData = function (ads, adGroups, sites) {
        var overviewData = buildExportOverview(buildExportHeader(metricsTypes.overview));
        var adsData = buildExportData(ads, metricsTypes.ads, buildExportHeader(metricsTypes.ads));
        var adGroupsData = buildExportData(adGroups, metricsTypes.adGroups, buildExportHeader(metricsTypes.adGroups));
        var sitesData = buildExportData(sites, metricsTypes.sites, buildExportHeader(metricsTypes.sites));
        return [
          {name: "Overview", data: overviewData},
          {name: "Ads", data: adsData},
          {name: "Ad Groups", data: adGroupsData},
          {name: "Sites", data: sitesData}
        ];
      };

      $scope.export = function (extension) {
        var dataExport = buildCampaignMetricsExportData($scope);
        ExportService.exportData(dataExport, $scope.goal.name + '-Metrics', extension);
      };

      /**
       * Data Table
       */

      var statusCompare = function (left, right) {
        if ($scope.orderBy !== "status") {
          return false;
        }
        var leftActive = left[0].status === "ACTIVE";
        var rightActive = right[0].status === "ACTIVE";
        return (!$scope.reverseSort && leftActive) || ($scope.reverseSort && rightActive);
      };

      var getInfoValue = function (ad) {
        for (var i = 0; i < ad.info.length; ++i) {
          if (ad.info[i].key === $scope.orderBy) {
            return ad.info[i].value;
          }
        }
      };

      var infoCompare = function (left, right) {
        if (tableHeadersKeys.indexOf($scope.orderBy) === -1) {
          return false;
        }
        var leftValue = getInfoValue(left[0]);
        var rightValue = getInfoValue(right[0]);
        return (!$scope.reverseSort && leftValue > rightValue) || ($scope.reverseSort && leftValue < rightValue);
      };

      var nameCompare = function (left, right) {
        if ($scope.orderBy !== "name") {
          return false;
        }
        return (!$scope.reverseSort && left[0].name > right[0].name) ||
          ($scope.reverseSort && left[0].name < right[0].name);
      };

      var formatCompare = function (left, right) {
        if ($scope.orderBy !== "format") {
          return false;
        }
        var leftValues = left[0].format.split("x");
        var rightValues = right[0].format.split("x");
        var leftWidth = leftValues[0];
        var leftHeight = leftValues[1];
        var rightWidth = rightValues[0];
        var rightHeight = rightValues[1];
        if (leftWidth === rightWidth) {
          if (leftHeight > rightHeight) {
           leftWidth += rightWidth;
          } else {
             rightWidth += leftWidth;
          }
        }
        return (!$scope.reverseSort && leftWidth > rightWidth) || ($scope.reverseSort && leftWidth < rightWidth);
      };

      var sort = function (array) {
        var len = array.length;
        if (len < 2) {
          return array;
        }
        var pivot = Math.ceil(len / 2);
        return merge(sort(array.slice(0, pivot)), sort(array.slice(pivot)));
      };

      var merge = function (left, right) {
        var result = [];
        while (left.length > 0 && right.length > 0) {
          if (infoCompare(left, right) || nameCompare(left, right) || formatCompare(left, right) || statusCompare(left, right)) {
            result.push(left.shift());
          } else {
            result.push(right.shift());
          }
        }
        return result.concat(left, right);
      };

      $scope.findAdGroup = function (adId) {
        for (var i = 0; i < $scope.adGroups.length; ++i) {
          for (var j = 0; j < $scope.adGroups[i].ads.length; ++j) {
            if ($scope.adGroups[i].ads[j].id === adId) {
              return $scope.adGroups[i];
            }
          }
        }
      };

      $scope.sortAdsBy = function (key) {
        $scope.reverseSort = (key !== $scope.orderBy) ? false : !$scope.reverseSort;
        $scope.orderBy = key;
        $scope.ads = sort($scope.ads);
      };

      $scope.sortAdGroupsBy = function (key) {
        $scope.reverseSort = (key !== $scope.orderBy) ? false : !$scope.reverseSort;
        $scope.orderBy = key;
        $scope.adGroups = sort($scope.adGroups);
      };

      $scope.sortSitesBy = function (key) {
        GoalAnalyticsReportService.mediaPerformance($stateParams.goal_id, $scope.hasCpa, 30).then(function (mediaPerformance) {
          $scope.mediaPerformance = mediaPerformance;
          $scope.reverseSort = (key !== $scope.orderBy) ? false : !$scope.reverseSort;
          $scope.orderBy = key;
          $scope.sites = sort(buildSites(mediaPerformance));
        });
      };

      var buildSites = function(mediaPerformance) {
        var sites = [];

        // Get media performance info indexes to identify the media information
        var siteClicksIdx = mediaPerformance.getHeaderIndex("clicks");
        var siteSpentIdx = mediaPerformance.getHeaderIndex("impressions_cost");
        var siteImpIdx = mediaPerformance.getHeaderIndex("impressions");
        var siteCpmIdx = mediaPerformance.getHeaderIndex("cpm");
        var siteCtrIdx = mediaPerformance.getHeaderIndex("ctr");
        var siteCpcIdx = mediaPerformance.getHeaderIndex("cpc");
        var siteCpaIdx = mediaPerformance.getHeaderIndex("cpa");

        var addSiteInfo = function (site, siteInfo) {
          // Build ad info object using ad performance values. Ad info is used to display and sort the data values.
          site.info = [];
          site.info[0] = {
            key: "impressions",
            type: siteInfo[siteImpIdx].type,
            value: siteInfo[siteImpIdx].value || 0
          };
          site.info[1] = {key: "cpm", type: siteInfo[siteCpmIdx].type, value: siteInfo[siteCpmIdx].value || 0};
          site.info[2] = {
            key: "impressions_cost",
            type: siteInfo[siteSpentIdx].type,
            value: siteInfo[siteSpentIdx].value || 0
          };
          site.info[3] = {
            key: "clicks",
            type: siteInfo[siteClicksIdx].type,
            value: siteInfo[siteClicksIdx].value || 0
          };
          site.info[4] = {key: "ctr", type: siteInfo[siteCtrIdx].type, value: siteInfo[siteCtrIdx].value || 0};
          site.info[5] = {key: "cpc", type: siteInfo[siteCpcIdx].type, value: siteInfo[siteCpcIdx].value || 0};
          if ($scope.hasCpa) {
            site.info[6] = {key: "cpa", type: siteInfo[siteCpaIdx].type, value: siteInfo[siteCpaIdx].value || 0};
          }
          return site;
        };

        var siteRows = mediaPerformance.getRows();
        for (var i = 0; i < siteRows.length; ++i) {
          var site = {name: siteRows[i][0].replace("site:web:", "")};
          var siteInfo = [siteRows[i][0]].concat(mediaPerformance.decorate(siteRows[i]));
          sites[i] = addSiteInfo(site, siteInfo);
        }

        return sites;
      };

      $scope.$watch('mediaPerformance', function (mediaPerformance) {
        if (angular.isDefined(mediaPerformance)) {
          $scope.sites = sort(buildSites(mediaPerformance));
        }
      });

     
      /**
       * Stats
       */
      $scope.$watchGroup(['reportDateRange', 'hasCpa'], function(values) {
        if (angular.isDefined(values[0]) && angular.isDefined(values[1])) {
          $scope.timeFilter = $scope.timeFilters[0];
          updateStatistics($scope, $stateParams.goal_id, GoalAnalyticsReportService, ChartsService, $scope.charts);
        }
      });

      $scope.refresh = function () {
        updateStatistics($scope, $stateParams.goal_id, GoalAnalyticsReportService, ChartsService, $scope.charts);
      };

      /**
       * Chart Utils
       */

      $scope.isHourlyMode = function () {
        return $scope.timeFilter === $scope.timeFilters[1];
      };

      $scope.dateRangeIsToday = function () {
        return GoalAnalyticsReportService.dateRangeIsToday();
      };

      $scope.chooseCharts = function () {
        var modalInstance = $modal.open({
          templateUrl: 'src/core/goals/report/ChooseCharts.html',
          scope: $scope,
          backdrop: 'static',
          controller: 'core/goals/report/ChooseChartsController',
          size: 'lg',
          resolve: {
            charts: function () {
              return $scope.charts;
            }
          }
        });

        modalInstance.result.then(function (charts) {
          $scope.charts = charts;
          updateChartsStatistics($scope, $stateParams.goal_id, GoalAnalyticsReportService, ChartsService, charts);
        });
      };

      //$scope.showDetails = function () {
      //  $scope.details = !$scope.details;
      //  if ($scope.chartArea === "chart-area")
      //    $scope.chartArea = "chart-area show-details";
      //  else
      //    $scope.chartArea = "chart-area";
      //  updateChartsStatistics($scope, $stateParams.goal_id, GoalAnalyticsReportService, ChartsService, $scope.charts);
      //};

      /**
       * Campaigns Management
       */



    }
  ]);
});
