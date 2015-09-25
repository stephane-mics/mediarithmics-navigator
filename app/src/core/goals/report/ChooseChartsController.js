define(['./module'], function (module) {
  'use strict';

  module.controller('core/goals/report/ChooseChartsController', [
    '$scope', '$modalInstance', 'charts', 'core/goals/report/ChartsService',
    function ($scope, $modalInstance, charts, ChartsService) {
      $scope.selectedCharts = [charts[0], charts[1]];
      $scope.chartsList = ChartsService.getChartsList();
      $scope.getChartName = ChartsService.getChartName;

      $scope.save = function () {
        $modalInstance.close($scope.selectedCharts);
      };

      $scope.cancel = function () {
        $modalInstance.close(charts);
      };

      $scope.swap = function() {
        var tmp = $scope.selectedCharts[0];
        $scope.selectedCharts[0] = $scope.selectedCharts[1];
        $scope.selectedCharts[1]= tmp;
      };
    }
  ]);
});


