define(['./module', 'lodash'], function (module, _) {
  'use strict';

  /**
   * The Report Wrapper is used to retrieve data from the json report object
   */
  function ReportWrapper(report) {
    var self = this;

    // Return the list of the report metrics (excluding the dimensions)
    this.getMetrics = function () {
      return _.filter(report.columns_headers, isMetrics);
    };

    // Return the index of a metric in the list of metrics (excluding the dimensions)
    this.getMetricIndex = function (metric) {
      return self.getMetrics().indexOf(metric);
    };

    // Get the first row where the first column matches the id
    this.getRow = _.memoize(function (id) {
      var row = _.select(report.rows, function (r) {
        return (r[0] + "") === (id + "");
      })[0];
      return self.decorate(row);
    });

    this.getHeaderIndex = _.memoize(function (header) {
      return report.columns_headers.indexOf(header);
    });

    this.getRowWithHeader = function (header, id) {
      var index = self.getHeaderIndex(header);
      var selectedRow = _.select(report.rows, function (row) {
        return (row[index] + "") === (id + "");
      })[0];
      return self.decorate(selectedRow);
    };

    this.getRowWithHeaders = function (header1, id1, header2, id2) {
      var index1 = self.getHeaderIndex(header1);
      var index2 = self.getHeaderIndex(header2);
      var selectedRow = _.select(report.rows, function (row) {
        return (row[index1] + "") === (id1 + "") && (row[index2] + "") === (id2 + "");
      })[0];
      return self.decorate(selectedRow);
    };

    this.decorate = _.memoize(function (row) {
      var self = this;
      if (row === undefined) {
        return _.map(new Array(self.getMetrics().length), function () {
          return 0;
        });
      } else {
        // Keep all values from the data that is a metric
        var values = _.rest(row, _.findLastIndex(report.columns_headers, notMetrics) + 1);
        // Replace 'null' with 0 to be able to use the data with the charts
        var clearedValues = values.map(function (v) {
          return v === null ? 0 : v
        });
        var type = _.map(self.getMetrics(), function (m) {
          return tableHeaders[m].type;
        });
        // Build data array matching data values and data types
        return _.map(_.zip([clearedValues, type]), function (t) {
          return {value: t[0], type: t[1]};
        });
      }
    });

    this.getMetricName = function (input) {
      if (angular.isDefined(tableHeaders[input]))
        return tableHeaders[input].name;
    };

    this.getMetricType = function (index) {
      return tableHeaders[this.getMetrics()[index]].type;
    };

    this.getRows = function () {
      return report.rows;
    };

    this.getHeaders = function() {
      var headers = [];
      var metrics = this.getMetrics();
      for (var i = 0; i < metrics.length; ++i) {
        headers.push(this.getMetricName(metrics[i]));
      }
      return headers;
    };
  }

  var isMetrics = function (e) {
    return !(/name|id|day|site/).test(e);
  };

  var notMetrics = function (e) {
    return (/name|id|day|site/).test(e);
  };

  var tableHeaders = {
    "creative_id": {name: "Id"},
    "ad_group_id": {name: "Id"},
    "ad_id": {name: "Id"},
    "site": {name: "Site"},
    "display_network": {name: "Display Network"},
    "ad_group_name": {name: "Ad Group Name"},
    "day": {name: "Date"},
    "impressions_cost": {name: "Spent", type: "currency"},
    "cost_impressions": {name: "Spent", type: "currency"}, // DEPRECATED TO BE REMOVED
    "impressions": {name: "Imp.", type: "number"},
    "cpc": {name: "CPC", type: "currency"},
    "clicks": {name: "Clicks", type: "number"},
    "ctr": {name: "CTR", type: "percent"},
    "cpm": {name: "CPM", type: "currency"},
    "cpa": {name: "CPA", type: "currency"}
  };


  /**
   * Campaign Analytics Report Service
   */
  module.factory('CampaignAnalyticsReportService',
    ['$resource', 'Restangular', 'core/common/auth/Session', 'core/common/auth/AuthenticationService', 'core/configuration',
      'moment', 'core/campaigns/report/ChartsService', 'core/campaigns/goals/GoalsService',
      function ($resource, Restangular, Session, AuthenticationService, configuration, moment, ChartsService, GoalsService) {
        var WS_URL = configuration.WS_URL;

        /**
         * Resources definition
         */

        var displayCampaignResource = $resource(
          WS_URL + "/reports/display_campaign_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        var adGroupResource = $resource(WS_URL + "/reports/ad_group_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        var adResource = $resource(WS_URL + "/reports/ad_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        var creativeResource = $resource(WS_URL + "/reports/creative_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        var mediaResource = $resource(WS_URL + "/reports/media_performance_report",
          {},
          {
            get: {
              method: 'GET',
              headers: {'Authorization': AuthenticationService.getAccessToken()}
            }
          }
        );

        /**
         * Default Date Range Used For Daily Stats
         */

        var range = {startDate: moment().subtract('days', 20), endDate: moment()};

        var startDate = function () {
          return moment(range.startDate).startOf('day');
        };

        var endDate = function () {
          return moment(range.endDate).add(1, 'day').startOf('day');
        };


        /**
         * Report Service
         */

        var ReportService = {};

        ReportService.getTableHeaders = function () {
          return tableHeaders;
        };

        ReportService.getPerformance = function (resource, metrics, filters) {
          return resource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "",
            metrics: metrics,
            filters: filters
          })
        };

        ReportService.buildPerformanceReport = function (resource, metrics, filters) {
          return this.getPerformance(resource, metrics, filters)
            .$promise.then(function (response) {
              return new ReportWrapper(response.data.report_view);
            });
        };

        ReportService.creativePerformance = function (campaignId, hasCpa) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.buildPerformanceReport(
            creativeResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa,
            "campaign_id==" + campaignId
          );
        };

        ReportService.adGroupPerformance = function (campaignId, hasCpa) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.buildPerformanceReport(
            adGroupResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa,
            "campaign_id==" + campaignId
          );
        };

        ReportService.adPerformance = function (campaignId, hasCpa) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.buildPerformanceReport(
            adResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa,
            "campaign_id==" + campaignId
          );
        };

        ReportService.mediaPerformance = function (campaignId, hasCpa) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.buildPerformanceReport(
            mediaResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa,
            "campaign_id==" + campaignId
          );
        };

        ReportService.kpi = function (campaignId, hasCpa) {
          var cpa = hasCpa ? ",cpa" : "";
          return this.getPerformance(mediaResource, "impressions,clicks,cpm,ctr,cpc,impressions_cost" + cpa, "campaign_id==" + campaignId)
            .$promise.then(function (response) {
              var report = response.data.report_view;
              var firstLine = report.rows[0] || [];
              return {
                "cpa": firstLine[_.indexOf(report.columns_headers, "cpa")] || 0,
                "cpc": firstLine[_.indexOf(report.columns_headers, "cpc")] || 0,
                "ctr": firstLine[_.indexOf(report.columns_headers, "ctr")] || 0,
                "cpm": firstLine[_.indexOf(report.columns_headers, "cpm")] || 0,
                "impressions_cost": firstLine[_.indexOf(report.columns_headers, "impressions_cost")] || 0
              };
            });
        };

        ReportService.allCampaigns = function (organisation_id) {
          return this.buildPerformanceReport(
            displayCampaignResource,
            "impressions,clicks,cpm,ctr,cpc,impressions_cost,cpa",
            "organisation==" + organisation_id
          );
        };

        ReportService.getDefaultDateRanges = function () {
          return {
            'Today': [moment(), moment()],
            'Last 7 Days': [moment().subtract('days', 6), moment()],
            'Last 30 Days': [moment().subtract('days', 29), moment()]
          };
        };

        ReportService.getDateRange = function () {
          return range;
        };

        ReportService.setDateRange = function (newRange) {
          range = newRange;
        };

        ReportService.getStartDate = function () {
          return startDate();
        };

        ReportService.getEndDate = function () {
          return endDate();
        };

        ReportService.dateRangeIsToday = function () {
          return this.getStartDate().valueOf() >= this.getEndDate().subtract('days', 1).valueOf();
        };


        ReportService.dailyPerformance = function (campaignId, leftMetric, rightMetric) {
          /**
           * This function iterates on report rows to map
           * x,y points in the Nvd3 format
           * WARNING : dateIter.valueOf returns the timestamp in the navigator timezone
           */
          var dailyStatsMapping = function (response) {
            var report = new ReportWrapper(response.data.report_view);
            var leftMetricIndex = report.getMetricIndex(leftMetric);
            var rightMetricIndex = report.getMetricIndex(rightMetric);
            var y1 = [], y2 = [];
            var dateIter = startDate();

            while (dateIter.isBefore(endDate())) {
              // iterates on a key in string format
              var key = dateIter.format("YYYY-MM-DD");
              var row = report.getRowWithHeader("day", key);

              if (row[leftMetricIndex] === 0) {
                y1.push({x: dateIter.valueOf(), y: 0});
              } else {
                y1.push({x: dateIter.valueOf(), y: row[leftMetricIndex].value});
              }

              if (row[rightMetricIndex] === 0) {
                y2.push({x: dateIter.valueOf(), y: 0});
              } else {
                y2.push({x: dateIter.valueOf(), y: row[rightMetricIndex].value});
              }

              dateIter = dateIter.add(1, 'day');
            }

            return [
              {
                area: true,
                values: y1,
                key: ChartsService.getChartName(leftMetric),
                color: "#FE5858"
              },
              {
                values: y2,
                area: true,
                right: true,
                key: ChartsService.getChartName(rightMetric),
                color: "#00AC67"
              }
            ];
          };

          return displayCampaignResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "day",
            metrics: leftMetric + "," + rightMetric,
            filters: "campaign_id==" + campaignId
          }).$promise.then(dailyStatsMapping);
        };

        /**
         * Hourly Performance For One Day
         */
        ReportService.hourlyPerformance = function (campaignId, leftMetric, rightMetric) {
          /**
           * This function iterates on report rows to map
           * x,y points in the Nvd3 format
           * WARNING : dateIter.valueOf returns the timestamp in the navigator timezone
           */
          var hourlyStatsMapping = function (response) {
            var y1 = [], y2 = [];
            var report = new ReportWrapper(response.data.report_view);
            var leftMetricIndex = report.getMetricIndex(leftMetric);
            var rightMetricIndex = report.getMetricIndex(rightMetric);
            var dateIter = startDate();

            while (dateIter.isBefore(endDate())) {
              // Key represent each hour
              var key = dateIter.format("YYYY-MM-DD");
              var key2 = dateIter.format("H");
              var row = report.getRowWithHeaders("day", key, "hour_of_day", key2);

              if (row[leftMetricIndex] === 0) {
                y1.push({x: dateIter.valueOf(), y: 0});
              } else {
                y1.push({x: dateIter.valueOf(), y: row[leftMetricIndex].value});
              }

              if (row[rightMetricIndex] === 0) {
                y2.push({x: dateIter.valueOf(), y: 0});
              } else {
                y2.push({x: dateIter.valueOf(), y: row[rightMetricIndex].value});
              }

              dateIter = dateIter.add(1, 'hour');
            }

            return [
              {
                area: true,
                values: y1,
                key: leftMetric,
                color: "#FE5858"
              },
              {
                values: y2,
                area: true,
                right: true,
                key: rightMetric,
                color: "#00AC67"
              }
            ];
          };

          return displayCampaignResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "day,hour_of_day",
            metrics: leftMetric + "," + rightMetric,
            filters: "campaign_id==" + campaignId
          }).$promise.then(hourlyStatsMapping);
        };

        return ReportService;
      }]);
});
