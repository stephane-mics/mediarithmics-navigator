define(['./module'], function (module) {
    'use strict';

    module.directive('mcsBidOptimizerDataSet', [
        'Restangular', 'moment','$stateParams',
        function (Restangular, moment,$stateParams) {
            return {
                restrict: 'E',
                scope: {
                    report: '='

                },
                link: function link(scope, element, attrs) {

                    scope.$watch('report', function (newVal) {
                        if (newVal) {


                            Restangular.one('bid_optimizers', $stateParams.bidOptimizerId).get().then(function (bidOptimizer) {
                                scope.bidOptimizer = bidOptimizer;

                            });

                            scope.summary = scope.report.$learning_summary;
                            scope.learningDataSet = scope.report.$learning_stats.$categories;
                            scope.validationDataSet = scope.report.$test_stats.$categories;

                            scope.learningDataSetSize = 0;
                            scope.validationDataSetSize = 0;

                            for (var i = 0; i < scope.learningDataSet.length; i++){
                                scope.learningDataSetSize = scope.learningDataSetSize + scope.learningDataSet[i].$instance_count;
                            }

                            for (i = 0; i < scope.validationDataSet.length; i++){
                                scope.validationDataSetSize  = scope.validationDataSetSize  + scope.validationDataSet[i].$instance_count;
                            }

                        }
                    }, true);

                },

                templateUrl: 'src/core/bidOptimizer/reports/view.data-set.html' };

        }]);

});
