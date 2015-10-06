define(['./module'], function (module) {

    'use strict';

    module.controller('core/datamart/queries/QueryBuilder', [
        '$scope', '$stateParams', 'Restangular', '$q', 'lodash', 'core/common/auth/Session',
        'core/datamart/queries/common/Common', '$modal', "async", 'core/common/promiseUtils', '$log', 'core/datamart/queries/QueryContainer', 'moment',

        function ($scope, $stateParams, Restangular, $q, lodash, Session, Common, $modal, async, promiseUtils, $log, QueryContainer, moment) {

            //dataTransfer hack : The jQuery event object does not have a dataTransfer property... true, but one can try:
            angular.element.event.props.push('dataTransfer');

            var datamartId = Session.getCurrentDatamartId();

            $scope.statistics = { total:0, hasEmail:0, hasCookie:0 };

            var fetchPropertySelectors = function(){
                Restangular.one('datamarts', datamartId).all('property_selectors').getList().then(function (result) {
                    $scope.propertySelectors = result;
                    $scope.selectorFamilies = lodash.groupBy(result, function (selector) {
                        return selector.selector_family;
                    });
                });
            };

            fetchPropertySelectors();

            $scope.propertySelectorOperators = Common.propertySelectorOperators;

            //var pQueryContainer = QueryContainer.load(datamartId, queryId);
            var pQueryContainer = new QueryContainer();

            /*pQueryContainer.then(function(queryContainer){
                $scope.queryContainer = queryContainer;
            });*/

            $scope.queryContainer = pQueryContainer;

                $scope.addGroup = function (queryContainer) {
                queryContainer.addConditionGroup();
            };

            $scope.removeGroup = function (queryContainer,conditionGroupContainer) {
                queryContainer.removeConditionGroup(conditionGroupContainer);
            };

            $scope.toggleExclude = function (conditionGroupContainer) {
                conditionGroupContainer.toggleExclude();
            };

            $scope.removeCond = function (conditionGroupContainer,condition) {
                conditionGroupContainer.removeCondition(condition);
            };

            //called when an selector is drap&drop
            $scope.dropped = function (dragEl, dropEl, conditionGroupContainer) {

                var drag = angular.element(document.getElementById(dragEl));
                var dragPropertySelectorId = drag.children('span').attr('id');
                var propertySelector = getDragSelector(dragPropertySelectorId);

                $scope.$apply(function () {
                    conditionGroupContainer.createCondition(propertySelector);
                });

            };

            $scope.refreshQuery = function (queryContainer) {
                var jsonQuery = queryContainer.prepareJsonQuery(datamartId);
                Restangular.one('datamarts', datamartId).customPOST(jsonQuery,'query_executions').then(function(result){
                    $scope.statistics.total = result.total;
                    $scope.statistics.hasEmail = result.total_with_email;
                    $scope.statistics.hasCookie = result.total_with_cookie;
                    $scope.statistics.executionTimeInMs = result.execution_time_in_ms;
                    $scope.statsError = null;
                }, function() {
                    $scope.statistics.total = 0;
                    $scope.statistics.hasEmail = 0;
                    $scope.statistics.hasCookie = 0;
                    $scope.statistics.executionTimeInMs = 0;
                    $scope.statsError = "There was an error executing query";
                });
            };

            $scope.toHumanReadableDuration = function(duration) {
                return moment.duration(duration,'ms').format("d [days] h [hours] m [minutes] s [seconds] S [ms]");
            };

            /*$scope.save = function (queryContainer) {
                queryContainer.save();
            };*/


            $scope.$on("mics-datamart-query:addProperty", function (event, params) {
                fetchPropertySelectors();
            });

            $scope.addPropertySelector = function(family){
                var newScope = $scope.$new(true);
                newScope.propertySelector = {
                  datamart_id:datamartId,
                  selector_family:family,
                  selector_name:'CUSTOM_PROPERTY'
                };
                $modal.open({
                    templateUrl: 'src/core/datamart/queries/create-property-selector.html',
                    scope: newScope,
                    backdrop: 'static',
                    controller: 'core/datamart/queries/CreatePropertySelectorController'
                });
            };

            //function that find the selectorInstance being drag&drop
            var getDragSelector = function (id) {
                var propertySelector = {};
                angular.forEach($scope.propertySelectors, function (selector) {
                    if (selector.id === id) {
                        propertySelector = selector;
                    }
                });
                return propertySelector;
            };

        }
    ]);



});
