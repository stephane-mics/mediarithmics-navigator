(function () {
  'use strict';

  var module = angular.module('core/campaigns/report');

  /*
   * Campaign list controller
   */
  module.controller('core/campaigns/report/BasicReportCampaignController', [
    '$scope', '$location', '$log', '$routeParams', 'Restangular', 'd3', 'moment', 'core/campaigns/DisplayCampaignService','CampaignAnalyticsReportService',
    function($scope, $location, $log, $routeParams,   Restangular, d3, moment, DisplayCampaignService, CampaignAnalyticsReportService) {
      $scope.valTo = 10;
      $log.debug("fetching "+$routeParams.campaign_id);
      DisplayCampaignService.initEditCampaign($routeParams.campaign_id).then(function() {
        $scope.campaign =  DisplayCampaignService.getCampaignValue();
      });

      $scope.reportDateRange = {startDate: moment().subtract('days', 7 ), endDate:moment()};

      $scope.$watch('reportDateRange', function() {

        $scope.xaxisdomain = [$scope.reportDateRange.startDate.toDate().getTime(),
          $scope.reportDateRange.endDate.toDate().getTime()
        ];
        CampaignAnalyticsReportService.dayPerformance(
          $scope.reportDateRange.startDate,
          $scope.reportDateRange.endDate,
          $routeParams.campaign_id,
          "impressions","cpm"
        ).then(function (data) {
          $scope.data1 = data;
        });
        CampaignAnalyticsReportService.adGroupPerformance(
          $scope.reportDateRange.startDate,
          $scope.reportDateRange.endDate,
          $routeParams.campaign_id
        ).then(function(data) {
          $scope.adGroupPerformance = data;
        });
        CampaignAnalyticsReportService.creativePerformance(
          $scope.reportDateRange.startDate,
          $scope.reportDateRange.endDate,
          $routeParams.campaign_id
        ).then(function(data) {
          $scope.creativePerformance = data;
        });
        CampaignAnalyticsReportService.adPerformance(
          $scope.reportDateRange.startDate,
          $scope.reportDateRange.endDate,
          $routeParams.campaign_id
        ).then(function(data) {
          $scope.adPerformance = data;
        });



      });
      $scope.xAxisTickFormat = function(){
        return function(d){
          return d3.time.format('%d %b')(new Date(d));
        };
      };

      $scope.xAxisTickFormat = function(){
        return function(d){
          return d3.time.format('%d %b')(new Date(d)); //uncomment for date format
        };
      };
      $scope.yAxisTickFormat = function(){
        return function(d){
          return d3.format(',f');
        };
      };
      $scope.y2AxisTickFormat = function(){
        return function(d){
          return '$' + d3.format(',.2f')(d);
        };
      };


      $scope.editCampaign = function(campaign) {

        $log.debug("> editCampaign for campaignId=", campaign.id);

        // get campaign edit template
        var editTemplateView = '/display-campaigns/expert/edit-campaign/';
        DisplayCampaignService.initEditCampaign(campaign.id).then(function(){
          $location.path(editTemplateView + campaign.id);
        });


      };
    }
  ]);

})();
