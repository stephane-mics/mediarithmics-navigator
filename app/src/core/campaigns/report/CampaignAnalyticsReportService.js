(function(){

  'use strict';


  var module  = angular.module('core/campaigns/report');
  module.factory('CampaignAnalyticsReportService', ['$resource', function($resource) {
     var displayCampaignResource = $resource("http://10.0.1.2:9000/reports/display_campaign_performance_report");
     
     var adGroupResource = $resource("http://10.0.1.2:9000/reports/adgroup_performance_report");
     var adResource = $resource("http://10.0.1.2:9000/reports/ad_performance_report");
     var creativeResource = $resource("http://10.0.1.2:9000/reports/creative_performance_report");

    
    var ReportService = {
      'creativePerformance': function(startDate, endDate, campaignId) {
        return  creativeResource.get({
          start_date:startDate.format('YYYY-MM-D'),
          end_date:endDate.format('YYYY-MM-D'),
          dimension:"",
          metrics:"impressions,clicks,cpm,cpc,cost_impressions",
          filters:"campaign_id=="+campaignId
        }).$promise.then(function (response) {
          return response.report_view;
        });

      },
      'adGroupPerformance': function(startDate, endDate, campaignId) {
        return  adGroupResource.get({
          start_date:startDate.format('YYYY-MM-D'),
          end_date:endDate.format('YYYY-MM-D'),
          dimension:"",
          metrics:"impressions,clicks,cpm,cpc,cost_impressions",
          filters:"campaign_id=="+campaignId
        }).$promise.then(function (response) {
          return response.report_view;
        });

      },
      'adPerformance': function(startDate, endDate, campaignId) {
        return  adResource.get({
          start_date:startDate.format('YYYY-MM-D'),
          end_date:endDate.format('YYYY-MM-D'),
          dimension:"",
          metrics:"impressions,clicks,cpm,cpc,cost_impressions",
          filters:"campaign_id=="+campaignId
        }).$promise.then(function (response) {
          return response.report_view;
        });

      },
      'dayPerformance': function(startDate, endDate, campaignId, leftMetric, rightMetric)  {
        var mapStatsToNvd3 = function (response) {
          var y1 = [], y2 = [];

          var daysIdx, leftIdx, rightIdx, campaignIdx;
          response.report_view.columns_headers.forEach(function (value, i){
            daysIdx = 0;
            if(value === rightMetric) {
              rightIdx = i;

            }
            if(value === leftMetric) {
              leftIdx = i;
            }
            if(value === "campaign_id") {
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
          start_date:startDate.format('YYYY-MM-D'),
          end_date:endDate.format('YYYY-MM-D'),
          dimension:"day",
          metrics:leftMetric + ","+rightMetric,
          filters:"campaign_id=="+campaignId
        }).$promise.then(mapStatsToNvd3);
      }
    };

  return ReportService;
  
  }]);


})();
