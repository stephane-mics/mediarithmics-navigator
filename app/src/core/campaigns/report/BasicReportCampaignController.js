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
    function ($scope, $location, $modal, $log, $stateParams, ChartsService, DisplayCampaignService, CampaignAnalyticsReportService, CampaignPluginService, Session) {
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

      var statusCompare = function (left, right) {
        if ($scope.orderBy !== "status") return false;
        var leftActive = left[0].status === "ACTIVE";
        var rightActive = right[0].status === "ACTIVE";
        console.log("reverseSort: ", $scope.reverseSort, " | left ", leftActive, " | right ", rightActive);
        return (!$scope.reverseSort && leftActive) || ($scope.reverseSort && rightActive);
      };

      var adInfoCompare = function (left, right) {
        if (tableHeadersKeys.indexOf($scope.orderBy) == -1) return false;
        return (!$scope.reverseSort && left[0].info[$scope.orderBy].value > right[0].info[$scope.orderBy].value) ||
          ($scope.reverseSort && left[0].info[$scope.orderBy].value < right[0].info[$scope.orderBy].value)
      };

      var nameCompare = function (left, right) {
        if ($scope.orderBy !== "name") return false;
        return (!$scope.reverseSort && left[0].name > right[0].name) ||
          ($scope.reverseSort && left[0].name < right[0].name);
      };

      var formatCompare = function (left, right) {
        if ($scope.orderBy !== "format") return false;
        var leftValues = left[0].format.split("x");
        var rightValues = right[0].format.split("x");
        var leftWidth = leftValues[0];
        var leftHeight = leftValues[1];
        var rightWidth = rightValues[0];
        var rightHeight = rightValues[1];
        if (leftWidth === rightWidth) {
          leftHeight > rightHeight ? leftWidth += rightWidth : rightWidth += leftWidth;
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
          if (adInfoCompare(left, right) || nameCompare(left, right) || formatCompare(left, right) || statusCompare(left, right)) {
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
        $scope.reverseSort = (key != $scope.orderBy) ? false : !$scope.reverseSort;
        $scope.orderBy = key;
        $scope.ads = sort($scope.ads);
        console.log("Sorted: ", $scope.ads);
      };

      $scope.sortAdGroupsBy = function (key) {
        $scope.reverseSort = (key != $scope.orderBy) ? false : !$scope.reverseSort;
        $scope.orderBy = key;
        $scope.adGroups = sort($scope.adGroups);
        console.log("Sorted: ", $scope.adGroups);
      };

      $scope.$watch('adPerformance + adGroupPerformance', function () {
        if (angular.isDefined($scope.adPerformance) && angular.isDefined($scope.adGroupPerformance)) {
          DisplayCampaignService.getDeepCampaignView($stateParams.campaign_id).then(function (campaign) {
            $scope.campaign = campaign;
            $scope.adgroups = campaign.ad_groups;
            $scope.ads = [];
            $scope.adGroups = [];
            console.log("Ad rows: ", $scope.adPerformance.getRows());

            // Get ad performance info indexes to identify the ad information
            var adClicksIdx = $scope.adPerformance.getHeaderIndex("clicks");
            var adSpentIdx = $scope.adPerformance.getHeaderIndex("impressions_cost");
            var adImpIdx = $scope.adPerformance.getHeaderIndex("impressions");
            var adCpmIdx = $scope.adPerformance.getHeaderIndex("cpm");
            var adCtrIdx = $scope.adPerformance.getHeaderIndex("ctr");
            var adCpcIdx = $scope.adPerformance.getHeaderIndex("cpc");
            var adCpaIdx = $scope.adPerformance.getHeaderIndex("cpa");

            // Get ad performance info indexes to identify the ad information
            var adGroupClicksIdx = $scope.adGroupPerformance.getHeaderIndex("clicks");
            var adGroupSpentIdx = $scope.adGroupPerformance.getHeaderIndex("impressions_cost");
            var adGroupImpIdx = $scope.adGroupPerformance.getHeaderIndex("impressions");
            var adGroupCpmIdx = $scope.adGroupPerformance.getHeaderIndex("cpm");
            var adGroupCtrIdx = $scope.adGroupPerformance.getHeaderIndex("ctr");
            var adGroupCpcIdx = $scope.adGroupPerformance.getHeaderIndex("cpc");
            var adGroupCpaIdx = $scope.adGroupPerformance.getHeaderIndex("cpa");

            var addAdInfo = function (ad, info) {
              // Build ad info object using ad performance values. Ad info is used to display and sort the data values.
              ad.info = {};
              ad.info.clicks = {type: info[adClicksIdx].type, value: info[adClicksIdx].value || 0};
              ad.info.impressions_cost = {type: info[adSpentIdx].type, value: info[adSpentIdx].value || 0};
              ad.info.impressions = {type: info[adImpIdx].type, value: info[adImpIdx].value || 0};
              ad.info.cpm = {type: info[adCpmIdx].type, value: info[adCpmIdx].value || 0};
              ad.info.ctr = {type: info[adCtrIdx].type, value: info[adCtrIdx].value || 0};
              ad.info.cpc = {type: info[adCpcIdx].type, value: info[adCpcIdx].value || 0};
              ad.info.cpa = {type: info[adCpaIdx].type, value: info[adCpaIdx].value || 0};
              return ad;
            };

            var addAdGroupInfo = function (adGroup, info) {
              // Build ad info object using ad performance values. Ad info is used to display and sort the data values.
              adGroup.info = {};
              adGroup.info.clicks = {type: info[adGroupClicksIdx].type, value: info[adGroupClicksIdx].value || 0};
              adGroup.info.impressions_cost = {
                type: info[adGroupSpentIdx].type,
                value: info[adGroupSpentIdx].value || 0
              };
              adGroup.info.impressions = {type: info[adGroupImpIdx].type, value: info[adGroupImpIdx].value || 0};
              adGroup.info.cpm = {type: info[adGroupCpmIdx].type, value: info[adGroupCpmIdx].value || 0};
              adGroup.info.ctr = {type: info[adGroupCtrIdx].type, value: info[adGroupCtrIdx].value || 0};
              adGroup.info.cpc = {type: info[adGroupCpcIdx].type, value: info[adGroupCpcIdx].value || 0};
              adGroup.info.cpa = {type: info[adGroupCpaIdx].type, value: info[adGroupCpaIdx].value || 0};
              return adGroup;
            };

            _.forEach(campaign.ad_groups, function (ad_group) {
              var adGroupInfo = [ad_group.id].concat($scope.adGroupPerformance.getRow(ad_group.id));
              $scope.adGroups.push(ad_group);
              ad_group = addAdGroupInfo(ad_group, adGroupInfo);
              _.forEach(ad_group.ads, function (ad) {
                var adInfo = [ad.id].concat($scope.adPerformance.getRow(ad.id));
                //console.log("Ad: ", ad);
                //console.log("AdInfo: ", adInfo);
                ad = addAdInfo(ad, adInfo);
                $scope.ads.push(ad);
              });
            });

            $scope.ads = sort($scope.ads, "clicks");
            console.log("Ads : ", $scope.ads);
            console.log("Ad Groups : ", $scope.adGroups);
          });
        }
      });

      /**
       * Stats
       */

      $scope.$watch('reportDateRange', function () {
        $scope.timeFilter = $scope.timeFilters[0];
        updateStatistics($scope, $stateParams.campaign_id, CampaignAnalyticsReportService, ChartsService, $scope.charts);
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
        })
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
