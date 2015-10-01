define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('goals/report', {

          url: '/{organisation_id}/goals/:goal_id/report',
          templateUrl: 'src/core/goals/report/show-report.html',
          data: {
            sidebar: {
              templateUrl : 'src/core/campaigns/campaigns-sidebar.html',
              selected: 'goals'
            }
          }

        });
    }
  ]);
});