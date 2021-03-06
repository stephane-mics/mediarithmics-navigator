/* global _ */

define(['./module'], function () {

  'use strict';


  /*
   * The Report Wrapper is used to retrieve data from the json report object
   */
  function ReportWrapper(report) {
    var self = this;
    
    // return the list of the report metrics (excluding the dimensions)
    this.getMetrics = function () {
      return _.filter(report.columns_headers, isMetrics);
    };

    // return the index of a metric in the list of metrics (excluding the dimensions)
    this.getMetricIndex = function(metric) {
      return self.getMetrics().indexOf(metric);
    }

    /**
     * get the first row where the first column match the id
     */
    this.getRow = _.memoize(function (id) {
      var row = _.select(report.rows, function(r) {return (r[0]+"") === (id+"");})[0];
      return self.decorate(row);
    });

    this.getHeaderIndex = _.memoize(function (header) {
      return report.columns_headers.indexOf(header);
    });

    this.getRowWithHeader = function(header, id) {
      var row = _.select(report.rows, function(r) {
        return (r[self.getHeaderIndex(header)]+"") === (id+"");
        })[0];
      return self.decorate(row);
    };


    this.decorate = _.memoize(function (row) {
      if (row === undefined) {
        return _.map(new Array(this.getMetrics().length), function () {return 0; });
      } else {
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

    this.getRows = function () {
      return report.rows;
    };

  }

//  function Report(report) {
//    ReportWrapper.call(this, report)
//  };
//
//  Report.prototype = _.create(ReportWrapper.prototype, {'constructor': Report});
//




  var isMetrics = function (e) {
    return !(/name|id|day|site/).test(e);
  };
  var notMetrics = function (e) {
    return (/name|id|day|site/).test(e);
  };

  var tableHeaders = {
    "creative_id": {name:"Id"},
    "ad_group_id": {name:"Id"},
    "ad_id": {name:"Id"},
    "site": {name:"Site"},
    "display_network": {name:"Display Network"},
    "ad_group_name": {name:"Ad Group Name"},
    "day": {name:"Date"},
    "impressions_cost": {name:"Spend", type:"currency"},
    "cost_impressions" : {name:"Spend", type:"currency"}, // DEPRECATED TO BE REMOVED
    "impressions": {name:"Impressions", type:"number"},
    "cpc": {name:"CPC", type:"currency"},
    "clicks": {name:"Clicks", type:"number"},
    "ctr": {name:"CTR", type:"percent"},
    "cpm": {name:"CPM", type:"currency"}

  };


  var module = angular.module('core/campaigns/report');
  module.factory('CampaignAnalyticsReportService',
    ['$resource', 'core/common/auth/Session', 'core/common/auth/AuthenticationService', 'core/configuration', 'moment',
    
      function ($resource, Session, AuthenticationService, configuration,moment ) {
      
        var WS_URL = configuration.WS_URL;
        if (configuration.ANALYTICS_ENGINE == "business-analytics") WS_URL = WS_URL.replace("api", "dev-api");
      
        var displayCampaignResource = $resource(
          WS_URL + "/reports/display_campaign_performance_report",
          {},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );

        var adGroupResource = {};
        if (configuration.ANALYTICS_ENGINE == "business-analytics") {
           adGroupResource = $resource(WS_URL + "/reports/ad_group_performance_report",
            {},
            {get: {
              method: 'GET',
              headers: { 'Authorization': AuthenticationService.getAccessToken() }
            }
            }
          );
        } else {
            // the legacy has a typo in the url : adgroup
           adGroupResource = $resource(WS_URL + "/reports/adgroup_performance_report",
            {},
            {get: {
              method: 'GET',
              headers: { 'Authorization': AuthenticationService.getAccessToken() }
            }
            }
          );
        }

        var adResource = $resource(WS_URL + "/reports/ad_performance_report",
          {},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );
        var creativeResource = $resource(WS_URL + "/reports/creative_performance_report",
          {},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );
        var mediaResource = $resource(WS_URL + "/reports/media_performance_report",
          {},
          {get: {
            method: 'GET',
            headers: { 'Authorization': AuthenticationService.getAccessToken() }
          }
          }
        );
        var range = {startDate: moment().subtract('days', 20), endDate: moment()};

        var startDate = function () {
          return moment(range.startDate).startOf('day');
        };
        var endDate = function () {
          return moment(range.endDate).add(1, 'day').startOf('day');
        };


        /*
         * LEGACY SERVICES
         */

        var ReportService = {};  

        if (configuration.ANALYTICS_ENGINE != "business-analytics") { 
          
  
          ReportService = {
            'creativePerformance': function (campaignId) {
              return  creativeResource.get({
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "",
                metrics: "impressions,clicks,cpm,ctr,cpc,cost_impressions",
                filters: "campaign_id==" + campaignId
              }).$promise.then(function (response) {
                  return new ReportWrapper( response.report_view);
                });
  
            },
            'adGroupPerformance': function (campaignId) {
              return  adGroupResource.get({
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "",
                metrics: "impressions,clicks,cpm,ctr,cpc,cost_impressions",
                filters: "campaign_id==" + campaignId
              }).$promise.then(function (response) {
                  return new ReportWrapper( response.report_view);
                });
  
            },
            'adPerformance': function (campaignId) {
              return  adResource.get({
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "",
                metrics: "impressions,clicks,cpm,ctr,cpc,cost_impressions",
                filters: "campaign_id==" + campaignId
              }).$promise.then(function (response) {
                  return new ReportWrapper( response.report_view);
                });
  
            },
            'mediaPerformance': function (campaignId) {
              return  mediaResource.get({
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "",
                metrics: "impressions,clicks,cpm,ctr,cpc,cost_impressions",
                filters: "campaign_id==" + campaignId
              }).$promise.then(function (response) {
                  return new ReportWrapper(response.report_view);
                });
  
            },
            'kpi': function (campaignId) {
              return  displayCampaignResource.get({
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
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
                      "impressions_cost" : 0,
                      "cost_impressions": 0,
                      "cpc": 0
                    };
                  }
                  return {
                    "ctr": firstLine[_.indexOf(report.columns_headers, "ctr")],
                    "cpm": firstLine[_.indexOf(report.columns_headers, "cpm")],
                    "impressions_cost": firstLine[_.indexOf(report.columns_headers, "cost_impressions")],
                    "cost_impressions": firstLine[_.indexOf(report.columns_headers, "cost_impressions")],
                    "cpc": firstLine[_.indexOf(report.columns_headers, "cpc")]
                  };
                });
  
            },
            'allCampaigns': function (organisation_id) {
              return  displayCampaignResource.get({
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "",
                metrics: "impressions,clicks,cpm,cpc,cost_impressions,ctr",
                filters: "organisation==" + organisation_id
              }).$promise.then(function (response) {
                  var report = response.report_view;
                  return new ReportWrapper(report);
                });
  
            },
            'getDefaultDateRanges': function () {
              return {
                  'Today': [moment(), moment()],
                  'Last 7 Days': [moment().subtract('days', 6), moment()],
                  'Last 30 Days': [moment().subtract('days', 29), moment()]
              };
            },
            'getDateRange': function () {
              return range;
            },
            'setDateRange': function (newRange) {
              range = newRange;
            },
            'getStartDate': function () {return startDate();},
            'getEndDate': function () {return endDate();},
  
            'dayPerformance': function (campaignId, leftMetric, rightMetric) {
  
              /**
               * If the axis only has one point, d3 will show a single point.
               * In that case, we want a continue line : we duplicate the point.
               * @param {Array} yAxis the axis to check.
               */
              var duplicatePointsIfNecessary = function(yAxis) {
                if(yAxis.length === 1) {
                  var date = moment(yAxis[0].x);
                  // the date starts at 0:00, we add 23 points to cover all the day
                  // d3 can do that but I don't want to change the default behavior for the other ranges.
                  for(var i = 1; i<24; i+=1) {
                    yAxis.push({
                      x: date.clone().add('hours', i),
                      y: yAxis[0].y
                    });
                  }
                }
              };
  
              /**
               * This function iterates on report rows to map
               * x,y points in the Nvd3 format
               * WARNING : dateIter.valueOf returns the timestamp in the navigator timezone
               */
              var mapStatsToNvd3 = function (response) {

                var report =new ReportWrapper(response.report_view);

                var y1 = [], y2 = [];
  
                var dateIter = startDate().add(2, "hour");
  
                while (dateIter.isBefore(endDate())) {
  
                  // business analytics method :
                  // var key = dateIter.format("YYYY-MM-DD");
                  // var row = report.getRow(key);
                  

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
                  dateIter = dateIter.add(1, 'day');
                }
  
                duplicatePointsIfNecessary(y1);
                duplicatePointsIfNecessary(y2);
  
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
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "day",
                metrics: leftMetric + "," + rightMetric,
                filters: "campaign_id==" + campaignId
              }).$promise.then(mapStatsToNvd3);
            }
          };
        
        }

       /*
        * BUSINESS ANALYTICS 
        */

        if (configuration.ANALYTICS_ENGINE == "business-analytics") { 
          
  
          ReportService.creativePerformance = function (campaignId) {
              return  creativeResource.get({
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "",
                metrics: "impressions,clicks,cpm,ctr,cpc,impressions_cost",
                filters: "campaign_id==" + campaignId
              }).$promise.then(function (response) {
                  return new ReportWrapper( response.report_view);
                });
  
            };
            
            
          ReportService.adGroupPerformance = function (campaignId) {
              return  adGroupResource.get({
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "",
                metrics: "impressions,clicks,cpm,ctr,cpc,impressions_cost",
                filters: "campaign_id==" + campaignId
              }).$promise.then(function (response) {
                  return new ReportWrapper( response.report_view);
                });
  
            };
            
            
          ReportService.adPerformance = function (campaignId) {
              return  adResource.get({
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "",
                metrics: "impressions,clicks,cpm,ctr,cpc,impressions_cost",
                filters: "campaign_id==" + campaignId
              }).$promise.then(function (response) {
                  return new ReportWrapper( response.report_view);
                });
  
            };
            
            
          ReportService.mediaPerformance = function (campaignId) {
              return  mediaResource.get({
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
              return  displayCampaignResource.get({
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
              return  displayCampaignResource.get({
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
            }
            
            
            ReportService.setDateRange = function (newRange) {
              range = newRange;
            }
            
            
            ReportService.getStartDate = function () {return startDate();}
            
            ReportService.getEndDate = function () {return endDate();}
  
            ReportService.dayPerformance = function (campaignId, leftMetric, rightMetric) {
  
              /**
               * If the axis only has one point, d3 will show a single point.
               * In that case, we want a continue line : we duplicate the point.
               * @param {Array} yAxis the axis to check.
               */
              var duplicatePointsIfNecessary = function(yAxis) {
                if(yAxis.length === 1) {
                  var date = moment(yAxis[0].x);
                  // the date starts at 0:00, we add 23 points to cover all the day
                  // d3 can do that but I don't want to change the default behavior for the other ranges.
                  for(var i = 1; i<24; i+=1) {
                    yAxis.push({
                      x: date.clone().add('hours', i),
                      y: yAxis[0].y
                    });
                  }
                }
              };
  
              /**
               * This function iterates on report rows to map
               * x,y points in the Nvd3 format
               * WARNING : dateIter.valueOf returns the timestamp in the navigator timezone
               */
              var mapStatsToNvd3 = function (response) {
                var report =new ReportWrapper(response.report_view);
                var leftMetricIndex = report.getMetricIndex(leftMetric);
                var rightMetricIndex = report.getMetricIndex(rightMetric);

                var y1 = [], y2 = [];
  
                var dateIter = startDate();
  
                while (dateIter.isBefore(endDate())) {
  
                  // iterates on a key in string format
                  var key = dateIter.format("YYYY-MM-DD");
                  var row = report.getRowWithHeader("day", key);

                  if(row[leftMetricIndex] === 0) {
                    y1.push({x: dateIter.valueOf(), y: 0 });
                  } else {
                    y1.push({x: dateIter.valueOf(), y: row[leftMetricIndex].value });
                  }

                  if(row[rightMetricIndex] === 0) {
                    y2.push({x: dateIter.valueOf(), y: 0 });
                  } else {
                    y2.push({x: dateIter.valueOf(), y: row[rightMetricIndex].value });
  
                  }
                  dateIter = dateIter.add(1, 'day');
                }
  
                duplicatePointsIfNecessary(y1);
                duplicatePointsIfNecessary(y2);
  

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
                organisation_id: Session.getCurrentWorkspace().organisation_id,
                start_date: startDate().format('YYYY-MM-D'),
                end_date: endDate().format('YYYY-MM-D'),
                dimension: "day",
                metrics: leftMetric + "," + rightMetric,
                filters: "campaign_id==" + campaignId
              }).$promise.then(mapStatsToNvd3);
            };
        
        }

        return ReportService;

      }]);


});
