(function () {

    'use strict';
    var module = angular.module('core/campaigns/report');
    module.directive('breakdownTable', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                reportView: '=report',
                iterator: '=iterator',
                startHeaders: '=headers'
            },
            templateUrl: '/src/core/campaigns/report/tables/breakdown-table.html'
        };
    });

    var tableHeaders = {
        "creative_id": "Id",
        "adgroup_id": "Id",
        "ad_id": "Id",
        "adgroup_name": "Ad Group Name",
        "cost_impressions": "Spend",
        "cpc": "CPC",
        "clicks": "Clicks",
        "cpm": "CPM"

    }


    module.filter('tableHeader', function () {
        return function (input) {
            input = input || '';
            var out = tableHeaders[input] || input;
            return out;

        }

    })

})();
