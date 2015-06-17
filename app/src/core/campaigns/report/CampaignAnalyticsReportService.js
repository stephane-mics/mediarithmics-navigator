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
      if (row === undefined) {
        return _.map(new Array(this.getMetrics().length), function () {
          return 0;
        });
      } else {
        var values = _.rest(row, _.findLastIndex(report.columns_headers, notMetrics) + 1);
        var type = _.map(this.getMetrics(), function (m) {
          return tableHeaders[m].type;
        });
        return _.map(_.zip([values, type]), function (t) {
          return {value: t[0], type: t[1]};
        });
      }
    });

    this.getMetricName = function (input) {
      return tableHeaders[input].name || input || '';
    };

    this.getMetricType = function (index) {
      return tableHeaders[this.getMetrics()[index]].type;
    };

    this.getRows = function () {
      return report.rows;
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
    "impressions_cost": {name: "Spend", type: "currency"},
    "cost_impressions": {name: "Spend", type: "currency"}, // DEPRECATED TO BE REMOVED
    "impressions": {name: "Impressions", type: "number"},
    "cpc": {name: "CPC", type: "currency"},
    "clicks": {name: "Clicks", type: "number"},
    "ctr": {name: "CTR", type: "percent"},
    "cpm": {name: "CPM", type: "currency"}
  };


  /**
   * Campaign Analytics Report Service
   */
  module.factory('CampaignAnalyticsReportService',
    ['$resource', 'core/common/auth/Session', 'core/common/auth/AuthenticationService', 'core/configuration', 'moment',
      function ($resource, Session, AuthenticationService, configuration, moment) {
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

        ReportService.creativePerformance = function (campaignId) {
          return creativeResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "",
            metrics: "impressions,clicks,cpm,ctr,cpc,impressions_cost",
            filters: "campaign_id==" + campaignId
          }).$promise.then(function (response) {
              return new ReportWrapper(response.report_view);
            });
        };

        ReportService.adGroupPerformance = function (campaignId) {
          return adGroupResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "",
            metrics: "impressions,clicks,cpm,ctr,cpc,impressions_cost",
            filters: "campaign_id==" + campaignId
          }).$promise.then(function (response) {
              return new ReportWrapper(response.report_view);
            });
        };


        ReportService.adPerformance = function (campaignId) {
          return adResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "",
            metrics: "impressions,clicks,cpm,ctr,cpc,impressions_cost",
            filters: "campaign_id==" + campaignId
          }).$promise.then(function (response) {
              return new ReportWrapper(response.report_view);
            });
        };


        ReportService.mediaPerformance = function (campaignId) {
          return mediaResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "",
            metrics: "impressions,clicks,cpm,ctr,cpc,impressions_cost",
            filters: "campaign_id==" + campaignId
          }).$promise.then(function (response) {
              return new ReportWrapper(response.report_view);
            });
        };

        ReportService.kpi = function (campaignId) {
          return displayCampaignResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "",
            metrics: "impressions,clicks,cpm,cpc,impressions_cost,ctr",
            filters: "campaign_id==" + campaignId
          }).$promise.then(function (response) {
              var report = response.report_view;
              var firstLine = report.rows[0];
              if (firstLine === undefined) {
                return {
                  "ctr": 0,
                  "cpm": 0,
                  "impressions_cost": 0,
                  "cpc": 0
                };
              }
              return {
                "ctr": firstLine[_.indexOf(report.columns_headers, "ctr")],
                "cpm": firstLine[_.indexOf(report.columns_headers, "cpm")],
                "impressions_cost": firstLine[_.indexOf(report.columns_headers, "impressions_cost")],
                "cpc": firstLine[_.indexOf(report.columns_headers, "cpc")]
              };
            });
        };


        ReportService.allCampaigns = function (organisation_id) {
          return displayCampaignResource.get({
            organisation_id: Session.getCurrentWorkspace().organisation_id,
            start_date: startDate().format('YYYY-MM-D'),
            end_date: endDate().format('YYYY-MM-D'),
            dimension: "",
            metrics: "impressions,clicks,cpm,cpc,impressions_cost,ctr",
            filters: "organisation==" + organisation_id
          }).$promise.then(function (response) {
              var report = response.report_view;
              return new ReportWrapper(report);
            });
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
          //console.log("DATE RANGE IS TODAY - ", range.startDate.format(), " | ", range.endDate.format());
          return this.getStartDate().valueOf() >= this.getEndDate().subtract('days', 1).valueOf();
        };


        ReportService.dailyPerformance = function (campaignId, leftMetric, rightMetric) {
          /**
           * This function iterates on report rows to map
           * x,y points in the Nvd3 format
           * WARNING : dateIter.valueOf returns the timestamp in the navigator timezone
           */
          var dailyStatsMapping = function (response) {
            var report = new ReportWrapper(response.report_view);
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
            //response.report_view.rows[0] = ["1020", "2015-06-15", 0, 27, 1358];

            var y1 = [], y2 = [];
            var report = new ReportWrapper(response.report_view);
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
