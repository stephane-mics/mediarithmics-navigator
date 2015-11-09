define(['./module', 'lodash'], function (module, _) {
  'use strict';

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

    CampaignAnalyticsReportService.adGroupPerformance(campaignId, $scope.hasCpa).then(function (data) {
      $scope.adGroupPerformance = data;
    });

    CampaignAnalyticsReportService.adPerformance(campaignId, $scope.hasCpa).then(function (data) {
      $scope.adPerformance = data;
    });

    CampaignAnalyticsReportService.mediaPerformance(campaignId, $scope.hasCpa, 30).then(function (data) {
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
  module.controller('core/campaigns/report/CampaignReportController', [
    '$scope', '$location', '$modal', '$log', '$stateParams', 'Restangular', 'core/campaigns/report/ChartsService', 'core/campaigns/DisplayCampaignService',
    'CampaignAnalyticsReportService', 'core/campaigns/CampaignPluginService', 'core/common/auth/Session', 'core/common/files/ExportService', 'core/campaigns/goals/GoalsService',
    function ($scope, $location, $modal, $log, $stateParams, Restangular, ChartsService, DisplayCampaignService,
              CampaignAnalyticsReportService, CampaignPluginService, Session, ExportService, GoalsService) {
      // Chart
      $scope.reportDateRange = CampaignAnalyticsReportService.getDateRange();
      $scope.reportDefaultDateRanges = CampaignAnalyticsReportService.getDefaultDateRanges();
      $scope.timeFilters = ['Daily', 'Hourly']; // Time filters order is important
      $scope.timeFilter = $scope.timeFilters[0];
      $scope.chartArea = "chart-area";
      $scope.charts = ['clicks', 'impressions'];
      $scope.getChartName = ChartsService.getChartName;

      // Tabs Set
      var tableHeadersKeys = Object.keys(CampaignAnalyticsReportService.getTableHeaders());
      $scope.reverseSort = false;
      $scope.orderBy = "clicks";

      Restangular.one('campaigns/' + $stateParams.campaign_id + '/goal_selections').get().then(function (goals) {
        for (var i = 0; i < goals.length; ++i) {
          if (GoalsService.isConversionType(goals[i].goal_selection_type)) {
            $scope.hasCpa = true;
            return;
          }
        }
        $scope.hasCpa = false;
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
        var metrics = [$scope.kpis.cpc, $scope.kpis.ctr, $scope.kpis.cpm, $scope.kpis.impressions_cost];
        if ($scope.hasCpa) {
          metrics.unshift($scope.kpis.cpa);
        }
        return header.concat([metrics]);
      };

      var buildExportHeader = function (metricsType) {
        var metricsHeaders = [];
        if (metricsType === metricsTypes.overview) {
          metricsHeaders = $scope.hasCpa ? ["CPA", "CPC", "CTR", "CPM", "Spent"] : ["CPC", "CTR", "CPM", "Spent"];
        } else {
          metricsHeaders = buildMetricsExportHeaders(metricsType);
        }
        return [
          ["Organisation:", Session.getOrganisationName($scope.campaign.organisation_id)],
          ["Campaign: ", $scope.campaign.name],
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
        // Get all the media data on export
        CampaignAnalyticsReportService.mediaPerformance($stateParams.campaign_id, $scope.hasCpa, null).then(function (mediaPerformance) {
          var sites = sort(buildSites(mediaPerformance));
          var dataExport = buildCampaignMetricsExportData($scope.ads, $scope.adGroups, sites);
          ExportService.exportData(dataExport, $scope.campaign.name + '-Metrics', extension);
        });
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
        CampaignAnalyticsReportService.mediaPerformance($stateParams.campaign_id, $scope.hasCpa, 30).then(function (mediaPerformance) {
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

      $scope.$watchGroup(['adPerformance', 'adGroupPerformance'], function (values) {
        if (angular.isDefined(values[0]) && angular.isDefined(values[1])) {
          var adPerformance = values[0];
          var adGroupPerformance = values[1];

          DisplayCampaignService.getDeepCampaignView($stateParams.campaign_id).then(function (campaign) {
            $scope.campaign = campaign;
            $scope.adgroups = campaign.ad_groups;
            $scope.ads = [];
            $scope.adGroups = [];

            // Get ad performance info indexes to identify the ad information
            var adClicksIdx = adPerformance.getHeaderIndex("clicks");
            var adSpentIdx = adPerformance.getHeaderIndex("impressions_cost");
            var adImpIdx = adPerformance.getHeaderIndex("impressions");
            var adCpmIdx = adPerformance.getHeaderIndex("cpm");
            var adCtrIdx = adPerformance.getHeaderIndex("ctr");
            var adCpcIdx = adPerformance.getHeaderIndex("cpc");
            var adCpaIdx = adPerformance.getHeaderIndex("cpa");

            // Get ad group performance info indexes to identify the ad group information
            var adGroupClicksIdx = adGroupPerformance.getHeaderIndex("clicks");
            var adGroupSpentIdx = adGroupPerformance.getHeaderIndex("impressions_cost");
            var adGroupImpIdx = adGroupPerformance.getHeaderIndex("impressions");
            var adGroupCpmIdx = adGroupPerformance.getHeaderIndex("cpm");
            var adGroupCtrIdx = adGroupPerformance.getHeaderIndex("ctr");
            var adGroupCpcIdx = adGroupPerformance.getHeaderIndex("cpc");
            var adGroupCpaIdx = adGroupPerformance.getHeaderIndex("cpa");

            var addAdInfo = function (ad, info) {
              // Build ad info object using ad performance values. Ad info is used to display and sort the data values.
              ad.info = [];
              ad.info[0] = {key: "impressions", type: info[adImpIdx].type, value: info[adImpIdx].value || 0};
              ad.info[1] = {key: "cpm", type: info[adCpmIdx].type, value: info[adCpmIdx].value || 0};
              ad.info[2] = {key: "impressions_cost", type: info[adSpentIdx].type, value: info[adSpentIdx].value || 0};
              ad.info[3] = {key: "clicks", type: info[adClicksIdx].type, value: info[adClicksIdx].value || 0};
              ad.info[4] = {key: "ctr", type: info[adCtrIdx].type, value: info[adCtrIdx].value || 0};
              ad.info[5] = {key: "cpc", type: info[adCpcIdx].type, value: info[adCpcIdx].value || 0};
              if ($scope.hasCpa) {
                ad.info[6] = {key: "cpa", type: info[adCpaIdx].type, value: info[adCpaIdx].value || 0};
              }
              return ad;
            };

            var addAdGroupInfo = function (adGroup, info) {
              // Build ad group info object using ad group performance values.
              adGroup.info = [];
              adGroup.info[0] = {
                key: "impressions",
                type: info[adGroupImpIdx].type,
                value: info[adGroupImpIdx].value || 0
              };
              adGroup.info[1] = {key: "cpm", type: info[adGroupCpmIdx].type, value: info[adGroupCpmIdx].value || 0};
              adGroup.info[2] = {
                key: "impressions_cost",
                type: info[adGroupSpentIdx].type,
                value: info[adGroupSpentIdx].value || 0
              };
              adGroup.info[3] = {
                key: "clicks",
                type: info[adGroupClicksIdx].type,
                value: info[adGroupClicksIdx].value || 0
              };
              adGroup.info[4] = {key: "ctr", type: info[adGroupCtrIdx].type, value: info[adGroupCtrIdx].value || 0};
              adGroup.info[5] = {key: "cpc", type: info[adGroupCpcIdx].type, value: info[adGroupCpcIdx].value || 0};
              if ($scope.hasCpa) {
                adGroup.info[6] = {key: "cpa", type: info[adGroupCpaIdx].type, value: info[adGroupCpaIdx].value || 0};
              }
              return adGroup;
            };

            _.forEach(campaign.ad_groups, function (ad_group) {
              var adGroupInfo = [ad_group.id].concat(adGroupPerformance.getRow(ad_group.id));
              $scope.adGroups.push(ad_group);
              ad_group = addAdGroupInfo(ad_group, adGroupInfo);
              _.forEach(ad_group.ads, function (ad) {
                var adInfo = [ad.id].concat(adPerformance.getRow(ad.id));
                ad = addAdInfo(ad, adInfo);
                $scope.ads.push(ad);
              });
            });

            $scope.ads = sort($scope.ads);
            $scope.adGroups = sort($scope.adGroups);
          });
        }
      });

      /**
       * Stats
       */
      $scope.$watchGroup(['reportDateRange', 'hasCpa'], function(values) {
        if (angular.isDefined(values[0]) && angular.isDefined(values[1])) {
          $scope.timeFilter = $scope.timeFilters[0];
          updateStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService, ChartsService, $scope.charts);
        }
      });

      $scope.refresh = function () {
        updateStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService, ChartsService, $scope.charts);
      };

      /**
       * Chart Utils
       */

      $scope.isHourlyMode = function () {
        return $scope.timeFilter === $scope.timeFilters[1];
      };

      $scope.dateRangeIsToday = function () {
        return CampaignAnalyticsReportService.dateRangeIsToday();
      };

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
        });
      };

      //$scope.showDetails = function () {
      //  $scope.details = !$scope.details;
      //  if ($scope.chartArea === "chart-area")
      //    $scope.chartArea = "chart-area show-details";
      //  else
      //    $scope.chartArea = "chart-area";
      //  updateChartsStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService, ChartsService, $scope.charts);
      //};

      /**
       * Campaigns Management
       */

      $scope.editCampaign = function (campaign) {
        CampaignPluginService.getCampaignEditorFromVersionId(campaign.editor_version_id).then(function (template) {
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

      /**
       * Utils
       */

      $scope.getCreativeUrl = function (ad) {
        var type = "display-ad";
        if (ad.creative_editor_group_id === "com.mediarithmics.creative.video") {
          type = "video-ad";
        }
        return "/" + Session.getCurrentWorkspace().organisation_id + "/creatives/" + type + "/" + ad.creative_editor_artifact_id + "/edit/" + ad.creative_id;
      };
    }
  ]);
});
