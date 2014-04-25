/* global _ */

(function () {

  'use strict';

  function ReportWrapper(report) {
    this.getMetrics = function () {
      return _.filter(report.columns_headers, isMetrics);
    };
    this.getRow = _.memoize(function (id) {
      id = parseInt(id);
      var row = _.select(report.rows, function(r) {return r[0] === id;})[0];
      if (row === undefined) {
        return _.map(new Array(this.getMetrics().length), function () {return 0; });
      } else {
        console.log("report.columns_headers: ",report.columns_headers)
        var values = _.rest(row, _.findLastIndex(report.columns_headers, notMetrics) + 1);
        var type = _.map(this.getMetrics(), function(m) {return tableHeaders[m].type;});
        return _.map(_.zip([values, type]), function(t) { return {value: t[0], type:t[1]}; });
      }
    });
    this.getMetricName = function (input) {
      input = input || '';
      var out = tableHeaders[input].name || input;
      return out;
    };

    this.getMetricType = function (index) {
      return tableHeaders[this.getMetrics()[index]].type;
    };
  }

//  function Report(report) {
//    ReportWrapper.call(this, report)
//  };
//
//  Report.prototype = _.create(ReportWrapper.prototype, {'constructor': Report});
//




  var isMetrics = function (e) {
    return !(/name|id|day/).test(e);
  };
  var notMetrics = function (e) {
    return (/name|id|day/).test(e);
  };

  var tableHeaders = {
    "creative_id": {name:"Id"},
    "adgroup_id": {name:"Id"},
    "ad_id": {name:"Id"},
    "adgroup_name": {name:"Ad Group Name"},
    "day": {name:"Date"},
    "cost_impressions": {name:"Spend", type:"currency"},
    "impressions": {name:"Impressions", type:"number"},
    "cpc": {name:"CPC", type:"currency"},
    "clicks": {name:"Clicks", type:"number"},
    "ctr": {name:"CTR", type:"percent"},
    "cpm": {name:"CPM", type:"currency"}

  };


  var module = angular.module('core/campaigns/report');
  module.factory('CampaignAnalyticsReportService',
    ['$resource', 'core/common/auth/Session', 'core/common/auth/AuthenticationService','core/configuration',
      function ($resource, Session, AuthenticationService, configuration) {
        var displayCampaignResource = $resource(
          configuration.WS_URL + "/reports/display_campaign_performance_report",
          {organisation_id: Session.getCurrentWorkspace().organisation_id},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );

        var adGroupResource = $resource(configuration.WS_URL + "/reports/adgroup_performance_report",
          {organisation_id: Session.getCurrentWorkspace().organisation_id},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );
        var adResource = $resource(configuration.WS_URL + "/reports/ad_performance_report",
          {organisation_id: Session.getCurrentWorkspace().organisation_id},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );
        var creativeResource = $resource(configuration.WS_URL + "/reports/creative_performance_report",
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
                return new ReportWrapper( response.report_view);
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
                return new ReportWrapper( response.report_view);
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
                return new ReportWrapper( response.report_view);
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
                  };
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
                return new ReportWrapper(report);
              });

          },
          'dayPerformance': function (startDate, endDate, campaignId, leftMetric, rightMetric) {
            startDate =  startDate.startOf('day');
            endDate = endDate.add(1, 'day').startOf('day');
            var mapStatsToNvd3 = function (response) {
              var report =new ReportWrapper(response.report_view);

              var test = report.getRow(startDate.valueOf());
              var y1 = [], y2 = [];



              var dateIter = startDate;
              while (dateIter.isBefore(endDate)) {
                var row = report.getRow(dateIter.valueOf());
                if(row[1] === 0) {
                  y1.push({x: dateIter.valueOf(), y: 0 });
                } else {
                  y1.push({x: dateIter.valueOf(), y: row[1].value });
                }
                if(row[0] === 0) {
                  y2.push({x: dateIter.valueOf(), y: 0 });
                } else {
                  y2.push({x: dateIter.valueOf(), y: row[0].value });

                }
                dateIter = dateIter.add(1, 'day')
              }

//              response.report_view.rows.forEach(function (row) {
//
//                var date = row[daysIdx];
//                y1.push({x: date, y: row[leftIdx] });
//                y2.push({x: date, y: row[rightIdx] });
//              });
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
