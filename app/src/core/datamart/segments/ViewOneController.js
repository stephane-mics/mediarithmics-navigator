define(['./module'], function (module) {

  'use strict';


  module.controller('core/datamart/segments/ViewOneController', [
    '$scope', 'moment', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', 'core/datamart/queries/QueryContainer', 'd3', '$timeout', 'core/datamart/segments/report/AudienceSegmentAnalyticsReportService',
    function ($scope, moment, $log, Restangular, Session, _, $stateParams, QueryContainer, d3, $timeout, AudienceSegmentAnalyticsReportService) {


      $scope.organisationId = $stateParams.organisation_id;

      $scope.datamartId = Session.getCurrentDatamartId();

      $scope.statsLoading = true;

      $scope.statistics = {total: 0, hasEmail: 0, hasCookie: 0};

      $scope.reportDateRange = AudienceSegmentAnalyticsReportService.getDateRange();
      $scope.reportDefaultDateRanges = AudienceSegmentAnalyticsReportService.getDefaultDateRanges();

      $scope.segmentId = $stateParams.segment_id;

      Restangular.one('audience_segments', $scope.segmentId).get().then(function (audienceSegment) {
          $scope.segment = audienceSegment;
         });


      var metricsBreakDown = ['user_points', 'user_accounts', 'emails', 'desktop_cookie_ids'];
      var metricsAdditionsDeletions = ['user_point_deletions', 'user_point_additions'];

      var legendPrettyPrint = function(legend){
        switch(legend){
          case "user_points" : return "User points";
          case "user_accounts" : return "User accounts";
          case "emails" : return "Emails";
          case "desktop_cookie_ids" : return "Desktop cookie ids";
          case "user_point_deletions" : return "User point deletions";
          case "user_point_additions" : return "User point additions";

        }

      };

      $scope.$watch('reportDateRange', function (newVal) {
        if (!newVal) {
          return;
        }

        AudienceSegmentAnalyticsReportService.setDateRange($scope.reportDateRange);

        /**
         * the per category chart
         */
        AudienceSegmentAnalyticsReportService.dailyPerformanceMetrics($scope.segmentId, metricsBreakDown).then(function (report) {
          $scope.breakDownData = [];
          for (var metricIdx = 0; metricIdx < metricsBreakDown.length; metricIdx++) {

            //quick fix to remove underscore in legend
            report[metricIdx].key = legendPrettyPrint(report[metricIdx].key);
            $scope.breakDownData.push(report[metricIdx]);

          }
        });

        /**
         * the creations deletions chart
         */
        AudienceSegmentAnalyticsReportService.dailyPerformanceMetrics($scope.segmentId, metricsAdditionsDeletions).then(function (report) {
          $scope.dataCreationSuppression = [];
          for (var metricIdx = 0; metricIdx < metricsAdditionsDeletions.length; metricIdx++) {
              report[metricIdx].key = legendPrettyPrint(report[metricIdx].key);
            if (metricsAdditionsDeletions[metricIdx] === 'user_point_deletions') {

              for (var i = 0; i < report[metricIdx].values.length; i++) {
                report[metricIdx].values[i].y = report[metricIdx].values[i].y * -1 ;
                report[metricIdx].color =  "#FE5858";
              }
              $scope.dataCreationSuppression.push(report[metricIdx]);
            }
            else {
              report[metricIdx].color =  "#00AC67";
              $scope.dataCreationSuppression.push(report[metricIdx]);
            }
          }
        });
      });


      Restangular.one('audience_segments', $scope.segmentId).get().then(function (segment) {
        $scope.segment = segment;

        AudienceSegmentAnalyticsReportService.getSegmentStatsLive(segment.id, $scope.datamartId).then(function (result){
          $scope.statistics.total = result.total;
          $scope.statistics.hasEmail = result.hasEmail;
          $scope.statistics.hasUserAccountId = result.hasUserAccountId;
          $scope.statistics.hasCookie = result.hasCookie;
          $scope.statistics.executionTimeInMs = result.executionTimeInMs;
          $scope.statsError = null;
          $scope.statsLoading = false;
        }, function () {
          $scope.statistics.total = 0;
          $scope.statistics.hasEmail = 0;
          $scope.statistics.hasUserAccountId = 0;
          $scope.statistics.hasCookie = 0;
          $scope.statistics.executionTimeInMs = 0;
          $scope.statsError = "There was an error executing query";
          $scope.statsLoading = false;
        });

      });


      $scope.optionsCreationSuppression = {
        chart: {
          type: 'multiBarChart',
          height: 300,
          margin: {
            top: 20,
            right: 20,
            bottom: 45,
            left: 45
          },
          clipEdge: true,
          duration: 500,
          stacked: true,
          showControls: false,
          xAxis: {
            tickFormat: function (d) {
              return d3.time.format('%d %b')(new Date(d));
            },
            showMaxMin: false
          },
          yAxis: {
            axisLabelDistance: -20,
            tickFormat: function (d) {
              return d3.format(',.1f')(Math.abs(d));
            }
          }
        }
      };

      $scope.breakDownOptions = {
        chart: {
          type: 'lineChart',
          height: 300,

          margin: {
            top: 20,
            right: 20,
            bottom: 40,
            left: 100
          },
          x: function (d) {
            return d.x;
          },
          y: function (d) {
            return d.y;
          },
          useInteractiveGuideline: true,
          xAxis: {
            tickFormat: function (d) {
              return d3.time.format('%d %b')(new Date(d));
            },
            showMaxMin: false
          },
          yAxis: {
            tickFormat: function (d) {
              return  d.toFixed(3);
            },
            axisLabelDistance: -0.01
          }

        }
      };


      /**
       *  I added this watch because the directive nvd3 shows the graph before the data completely loaded, and it gives a svg width bigger than the container
       *  see https://github.com/krispo/angular-nvd3/issues/40
       */
      $scope.$watch('breakDownData', function () {
        $timeout(function () {
          window.dispatchEvent(new Event('resize'));
        }, 200);
      });

      $scope.$watch('dataCreationSuppression', function () {
        $timeout(function () {
          window.dispatchEvent(new Event('resize'));
        }, 200);
      });

    }
  ]);
});
