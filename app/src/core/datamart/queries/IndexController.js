define(['./module'], function (module) {

    'use strict';

    module.controller('core/datamart/queries/IndexController', [
        '$scope', '$stateParams', 'Restangular', '$q', 'lodash', 'core/common/auth/Session',
        'core/datamart/queries/common/Common', '$modal', "async", 'core/common/promiseUtils', '$log', 'core/datamart/queries/QueryContainer', 'moment', '$rootScope',
        '$location',

        function ($scope, $stateParams, Restangular, $q, lodash, Session, Common, $modal, async, promiseUtils, $log, QueryContainer, moment, $rootScope, $location) {

            $scope.datamartId = Session.getCurrentDatamartId();

            $scope.$on("mics-new-segment-popup:save-query", function (event, params) {
                $scope.$broadcast("mics-query-tool:save");
            });

            $scope.$on("mics-query-tool:save-complete", function (event, params) {
                $scope.$broadcast("mics-new-segment-popup:query-save-complete",params);
            });

            $scope.$on("mics-query-tool:save-error", function (event, params) {
                $scope.$broadcast("mics-new-segment-popup:query-save-error",params);
            });

            $scope.refreshQuery = function () {
                $scope.$broadcast("mics-query-tool:refresh");
            };

            $scope.newSegment = function () {
                var newScope = $scope.$new(true);
                newScope.segment = {};
                $modal.open({
                    templateUrl: 'src/core/datamart/queries/new-segment.html',
                    scope: newScope,
                    backdrop: 'static',
                    controller: 'core/datamart/queries/NewSegmentController'
                });
            };

        }
    ]);



});
