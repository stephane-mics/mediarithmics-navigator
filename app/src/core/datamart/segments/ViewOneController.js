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
      var metricsBreakDown = ['user_points', 'user_accounts', 'emails', 'desktop_devices'];
      var metricsAdditionsDeletions = ['user_point_deletions', 'user_point_additions'];

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
            $scope.breakDownData.push(report[metricIdx]);

          }
        });

        /**
         * the creations deletions chart
         */
        AudienceSegmentAnalyticsReportService.dailyPerformanceMetrics($scope.segmentId, metricsAdditionsDeletions).then(function (report) {
          $scope.dataCreationSuppression = [];
          for (var metricIdx = 0; metricIdx < metricsAdditionsDeletions.length; metricIdx++) {
            if (metricsAdditionsDeletions[metricIdx] == 'user_point_deletions') {

              for (var i = 0; i < report[metricIdx].values.length; i++) {
                report[metricIdx].values[i].y = report[metricIdx].values[i].y * -1
              }
              $scope.dataCreationSuppression.push(report[metricIdx]);
            }
            else {
              $scope.dataCreationSuppression.push(report[metricIdx]);
            }

          }
          console.log($scope.dataCreationSuppression);
        });


      });


      Restangular.one('audience_segments', $scope.segmentId).get().then(function (segment) {
        $scope.segment = segment;

        Restangular.one('datamarts', $scope.datamartId).customPOST({}, 'query_executions', {query_id: $scope.segment.query_id}).then(function (result) {
          $scope.statistics.total = result.total;
          $scope.statistics.hasEmail = result.total_with_email;
          $scope.statistics.hasUserAccountId = result.total_with_user_account_id;
          $scope.statistics.hasCookie = result.total_with_cookie;
          $scope.statistics.executionTimeInMs = result.execution_time_in_ms;
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

      /*AudienceSegmentAnalyticsReportService.audienceSegments($scope.segmentId).then(function (report) {

       console.log(report);

       if(report.getRows().length ===0){
       $scope.statistics.total = 0;
       $scope.statistics.hasEmail = 0;
       $scope.statistics.hasUserAccountId = 0;
       $scope.statistics.hasCookie = 0;

       }
       else{
       var row = report.getRow(0);
       $scope.statistics.total = row[report.getHeaderIndex('user_points')];
       $scope.statistics.hasEmail = row[report.getHeaderIndex('emails')];
       $scope.statistics.hasUserAccountId = row[report.getHeaderIndex('user_accounts')];
       $scope.statistics.hasCookie = row[report.getHeaderIndex('user_point_additions')];
       }
       $scope.statsLoading=false;
       });
       */

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
       *  I added this watch because the directive nvd3 shows the graph before the data completely loaded, and it gives a svg width bigger than the container, see https://github.com/krispo/angular-nvd3/issues/40
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

