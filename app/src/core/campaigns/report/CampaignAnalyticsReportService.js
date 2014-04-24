(function () {

  'use strict';

  function ReportWrapper(report) {
    this.getMetrics = function () {
      return _.filter(report.columns_headers, isMetrics)
    };
    this.getRow = _.memoize(function (id) {
      var row = _.select(report.rows, function(r) {return r[0] == id})[0]
      if (row === undefined) {
        return _.map(new Array(this.getMetrics().length), function () {return 0 });
      } else {
        var values = _.rest(row, _.findLastIndex(report.columns_headers, notMetrics) + 1)
        var type = _.map(this.getMetrics(), function(m) {return tableHeaders[m].type});
        return _.map(_.zip([values, type]), function(t) { return {value: t[0], type:t[1]} });
      }
    });
    this.getMetricName = _.memoize(function (input) {
      input = input || '';
      var out = tableHeaders[input].name || input;
      return out;
    });

    this.getMetricType = _.memoize(function (index) {
      return tableHeaders[this.getMetrics()[index]].type;
    });
  };

  function Report(report) {
    ReportWrapper.call(this, report)
  };

  Report.prototype = _.create(ReportWrapper.prototype, {'constructor': Report});





    var isMetrics = function (e) {
      return !/name|id/.test(e);
    };
    var notMetrics = function (e) {
      return /name|id/.test(e);
    };

  var tableHeaders = {
    "creative_id": {name:"Id"},
    "adgroup_id": {name:"Id"},
    "ad_id": {name:"Id"},
    "adgroup_name": {name:"Ad Group Name"},
    "cost_impressions": {name:"Spend", type:"currency"},
    "impressions": {name:"Impressions", type:"number"},
    "cpc": {name:"CPC", type:"currency"},
    "clicks": {name:"Clicks", type:"number"},
    "ctr": {name:"CTR", type:"percent"},
    "cpm": {name:"CPM", type:"currency"}

  }


  var module = angular.module('core/campaigns/report');
  module.factory('CampaignAnalyticsReportService',
    ['$resource', 'core/common/auth/Session', 'core/common/auth/AuthenticationService',
      function ($resource, Session, AuthenticationService) {
        var displayCampaignResource = $resource(
          "http://10.0.1.2:9113/public/v1/reports/display_campaign_performance_report",
          {organisation_id: Session.getCurrentWorkspace().organisation_id},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );

        var adGroupResource = $resource("http://10.0.1.2:9113/public/v1/reports/adgroup_performance_report",
          {organisation_id: Session.getCurrentWorkspace().organisation_id},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );
        var adResource = $resource("http://10.0.1.2:9113/public/v1/reports/ad_performance_report",
          {organisation_id: Session.getCurrentWorkspace().organisation_id},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );
        var creativeResource = $resource("http://10.0.1.2:9113/public/v1/reports/creative_performance_report",
          {organisation_id: Session.getCurrentWorkspace().organisation_id},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );


        var ReportService = {
          'creativePerformance': function (startDate, endDate, campaignId) {
            return  creativeResource.get({
              start_date: startDate.format('YYYY-MM-D'),
              end_date: endDate.format('YYYY-MM-D'),
              dimension: "",
              metrics: "impressions,clicks,cpm,cpc,cost_impressions",
              filters: "campaign_id==" + campaignId
            }).$promise.then(function (response) {
                return new Report( response.report_view);
              });

          },
          'adGroupPerformance': function (startDate, endDate, campaignId) {
            return  adGroupResource.get({
              start_date: startDate.format('YYYY-MM-D'),
              end_date: endDate.format('YYYY-MM-D'),
              dimension: "",
              metrics: "impressions,clicks,cpm,cpc,cost_impressions",
              filters: "campaign_id==" + campaignId
            }).$promise.then(function (response) {
                return new Report( response.report_view);
              });

          },
          'adPerformance': function (startDate, endDate, campaignId) {
            return  adResource.get({
              start_date: startDate.format('YYYY-MM-D'),
              end_date: endDate.format('YYYY-MM-D'),
              dimension: "",
              metrics: "impressions,clicks,cpm,cpc,cost_impressions",
              filters: "campaign_id==" + campaignId
            }).$promise.then(function (response) {
                return new Report( response.report_view);
              });

          },
          'kpi': function (startDate, endDate, campaignId) {
            return  displayCampaignResource.get({
              start_date: startDate.format('YYYY-MM-D'),
              end_date: endDate.format('YYYY-MM-D'),
              dimension: "",
              metrics: "impressions,clicks,cpm,cpc,cost_impressions,ctr",
              filters: "campaign_id==" + campaignId
            }).$promise.then(function (response) {
                var report = response.report_view;
                var firstLine = report.rows[0];
                if (firstLine === undefined) {
                  return {
                    "ctr": 0,
                    "cpm": 0,
                    "cost_impressions": 0,
                    "cpc": 0
                  }
                }
                return {
                  "ctr": firstLine[_.indexOf(report.columns_headers, "ctr")],
                  "cpm": firstLine[_.indexOf(report.columns_headers, "cpm")],
                  "cost_impressions": firstLine[_.indexOf(report.columns_headers, "cost_impressions")],
                  "cpc": firstLine[_.indexOf(report.columns_headers, "cpc")]
                };
              });

          },
          'allCampaigns': function (startDate, endDate, organisation_id) {
            return  displayCampaignResource.get({
              start_date: startDate.format('YYYY-MM-D'),
              end_date: endDate.format('YYYY-MM-D'),
              dimension: "",
              metrics: "impressions,clicks,cpm,cpc,cost_impressions,ctr",
              filters: "organisation==" + organisation_id
            }).$promise.then(function (response) {
                var report = response.report_view;
                return new Report(report)
              });

          },
          'dayPerformance': function (startDate, endDate, campaignId, leftMetric, rightMetric) {
            var mapStatsToNvd3 = function (response) {
              var y1 = [], y2 = [];

              var daysIdx, leftIdx, rightIdx, campaignIdx;
              response.report_view.columns_headers.forEach(function (value, i) {
                daysIdx = 0;
                if (value === rightMetric) {
                  rightIdx = i;

                }
                if (value === leftMetric) {
                  leftIdx = i;
                }
                if (value === "campaign_id") {
                  campaignIdx = i;
                }
              });
              response.report_view.rows.forEach(function (row) {
                var date = row[daysIdx];
                y1.push({x: date, y: row[leftIdx] });
                y2.push({x: date, y: row[rightIdx] });
              });
              return [
                {
                  area: true,
                  values: y1,
                  key: leftMetric,
                  color: "#00AC67"
                },
                {
                  values: y2,
                  area: true,
                  right: true,
                  key: rightMetric,
                  color: "#FE5858"
                }
              ];
            };

            return  displayCampaignResource.get({
              start_date: startDate.format('YYYY-MM-D'),
              end_date: endDate.format('YYYY-MM-D'),
              dimension: "day",
              metrics: leftMetric + "," + rightMetric,
              filters: "campaign_id==" + campaignId
            }).$promise.then(mapStatsToNvd3);
          }
        };

        return ReportService;

      }]);


})();
