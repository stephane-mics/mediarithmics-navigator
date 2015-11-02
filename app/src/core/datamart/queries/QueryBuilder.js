define(['./module'], function (module) {

    'use strict';

    module.controller('core/datamart/queries/QueryBuilder', [
        '$scope', '$stateParams', 'Restangular', '$q', 'lodash', 'core/common/auth/Session',
        'core/datamart/queries/common/Common', '$modal', "async", 'core/common/promiseUtils', '$log', 'core/datamart/queries/QueryContainer', 'moment', '$rootScope',
        '$location',

        function ($scope, $stateParams, Restangular, $q, lodash, Session, Common, $modal, async, promiseUtils, $log, QueryContainer, moment, $rootScope, $location) {

            //dataTransfer hack : The jQuery event object does not have a dataTransfer property... true, but one can try:
            angular.element.event.props.push('dataTransfer');

            var datamartId = Session.getCurrentDatamartId();

            $scope.statistics = { total:0, hasEmail:0, hasCookie:0 };

            var fetchPropertySelectors = function(){
                Restangular.one('datamarts', datamartId).all('property_selectors').getList().then(function (result) {
                    $scope.propertySelectors = result;
                    $scope.selectorFamilies = lodash.groupBy(result, function (selector) {
                        if (selector.selector_family === 'EVENTS'){
                            return selector.family_parameters;
                        }else{
                            return selector.selector_family;
                        }
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

            $scope.goToTimeline = function(userPointId){
                $location.path("/" + $stateParams.organisation_id + "/datamart/users/upid/" + userPointId);
            };

            $scope.addGroup = function (queryContainer) {
                queryContainer.addGroupContainer();
            };

            $scope.removeGroup = function (queryContainer,conditionGroupContainer) {
                queryContainer.removeGroupContainer(conditionGroupContainer);
            };

            $scope.toggleExclude = function (conditionGroupContainer) {
                conditionGroupContainer.toggleExclude();
            };

            $scope.removeCond = function (elementContainer,condition) {
                elementContainer.removeCondition(condition);
            };

            $scope.removeElem = function (conditionGroupContainer,elementContainer) {
                conditionGroupContainer.removeElementContainer(elementContainer);
            };

            $rootScope.$on("LVL-DRAG-START", function () {
                $scope.$apply(function () {
                    $scope.onGoingDrag = true;
                });
            });

            $rootScope.$on("LVL-DRAG-END", function () {
                $scope.$apply(function () {
                    $scope.onGoingDrag = false;
                });
            });

            $scope.addElement = function (dragEl, dropEl, conditionGroupContainer) {

                var drag = angular.element(document.getElementById(dragEl));
                var dragPropertySelectorId = drag.children('span').attr('id');
                var propertySelector = getDragSelector(dragPropertySelectorId);

                $scope.$apply(function () {
                    conditionGroupContainer.createElementWithCondition(propertySelector);
                });
            };

            $scope.addCondition = function (dragEl, dropEl, elementContainer) {

                var drag = angular.element(document.getElementById(dragEl));
                var dragPropertySelectorId = drag.children('span').attr('id');
                var propertySelector = getDragSelector(dragPropertySelectorId);

                $scope.$apply(function () {
                    elementContainer.createCondition(propertySelector);
                });
            };

            $scope.addSelectedValue = function (dragEl, dropEl, queryContainer) {

                var drag = angular.element(document.getElementById(dragEl));
                var dragPropertySelectorId = drag.children('span').attr('id');
                var propertySelector = getDragSelector(dragPropertySelectorId);

                $scope.$apply(function () {
                    queryContainer.createSelectedValue(propertySelector);
                });
            };

            $scope.removeSelectedValue = function (queryContainer,selectedValue) {
                queryContainer.removeSelectedValue(selectedValue);
                $scope.results = [];
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

                $scope.results = [];

                if (angular.element(document.getElementById('results')).attr('class').includes("active") && $scope.statistics.total !== 0 && $scope.queryContainer.selectedValues.length !== 0){
                    Restangular.one('datamarts', datamartId).customPOST(jsonQuery,'query_executions/result_preview').then(function(results){
                        $scope.results = results;
                    });
                }
            };

            $scope.refreshQuery($scope.queryContainer);

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
