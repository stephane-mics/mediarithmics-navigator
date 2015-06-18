define(['./module'], function (module) {
  'use strict';

  module.controller('core/campaigns/report/ChooseChartsController', [
    '$scope', '$modalInstance', 'charts',
    function ($scope, $modalInstance, charts) {
      $scope.charts = { chart1: charts.chart1, chart2: charts.chart2 };
      $scope.chartsList = [
        'Clicks',
        'Impressions',
        'CPC',
        'CTR',
        'CPM',
        'Spent'
      ];

      $scope.choose = function () {
        $modalInstance.close($scope.charts);
      };

      $scope.cancel = function () {
        $modalInstance.close(charts);
      };
    }
  ]);
});


