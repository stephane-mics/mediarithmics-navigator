define(['./module'], function (module) {

    'use strict';

    module.directive('mcsQueryTool', [
        'Restangular', '$q', 'lodash', 'core/common/auth/Session',
        'core/datamart/queries/common/Common', '$modal', "async",
        'core/common/promiseUtils', '$log', 'core/datamart/queries/QueryContainer', 'moment', '$rootScope',

        function (Restangular, $q, lodash, Session, Common, $modal, async, promiseUtils, $log, QueryContainer, moment, $rootScope) {
            return {
                restrict: 'E',
                scope: {
                    // same as '=condition'
                    queryId: '=',
                    autoload: '=',
                    datamartId: '='
                },
                controller: function ($scope) {
                    //dataTransfer hack : The jQuery event object does not have a dataTransfer property... true, but one can try:
                    angular.element.event.props.push('dataTransfer');

                    var organisationId = Session.getCurrentWorkspace().organisation_id;

                    $scope.statistics = {total: 0, hasEmail: 0, hasCookie: 0};

                    var fetchPropertySelectors = function () {
                        Restangular.one('datamarts', $scope.datamartId).all('property_selectors').getList().then(function (result) {
                            $scope.propertySelectors = result;
                            $scope.selectorFamilies = lodash.groupBy(result, function (selector) {
                                if (selector.selector_family === 'EVENTS') {
                                    return selector.family_parameters;
                                } else {
                                    return selector.selector_family;
                                }
                            });
                        });
                    };

                    fetchPropertySelectors();

                    $scope.propertySelectorOperators = Common.propertySelectorOperators;

                    var queryContainer = new QueryContainer($scope.datamartId);

                    $scope.$watch('queryId', function () {
                        if ($scope.queryId){
                            queryContainer.load($scope.queryId).then(function success(){
                                if ($scope.autoload){
                                    reload();
                                }
                                $log.info("queryId " + $scope.queryId + " successfully loaded");
                            }, function error(reason){
                                $scope.error = "Cannot load query";
                            });
                        }
                    });

                    $scope.queryContainer = queryContainer;

                    $scope.goToTimeline = function (userPointId) {
                        return "/#/" + organisationId + "/datamart/users/upid/" + userPointId;
                    };

                    $scope.addGroup = function (queryContainer, $event) {
                        if ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();
                        }
                        queryContainer.addGroupContainer();
                    };

                    $scope.removeGroup = function (queryContainer, conditionGroupContainer) {
                        queryContainer.removeGroupContainer(conditionGroupContainer);
                    };

                    $scope.toggleExclude = function (conditionGroupContainer) {
                        conditionGroupContainer.toggleExclude();
                    };

                    $scope.removeCond = function (elementContainer, condition) {
                        elementContainer.removeCondition(condition);
                    };

                    $scope.removeElem = function (conditionGroupContainer, elementContainer) {
                        conditionGroupContainer.removeElementContainer(elementContainer);
                    };

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

                    $scope.removeSelectedValue = function (queryContainer, selectedValue) {
                        queryContainer.removeSelectedValue(selectedValue);
                        $scope.results = [];
                    };

                    var resultsTabSelected = false;

                    $scope.resultsTabSelect = function(){
                        resultsTabSelected = true;
                        reload();
                    };

                    $scope.resultsTabDeselect = function(){
                        resultsTabSelected = false;
                    };

                    var reload = function () {
                        var jsonQuery = queryContainer.prepareJsonQuery();
                        Restangular.one('datamarts', $scope.datamartId).customPOST(jsonQuery, 'query_executions').then(function (result) {
                            $scope.statistics.total = result.total;
                            $scope.statistics.hasEmail = result.total_with_email;
                            $scope.statistics.hasCookie = result.total_with_cookie;
                            $scope.statistics.executionTimeInMs = result.execution_time_in_ms;
                            $scope.statsError = null;
                        }, function () {
                            $scope.statistics.total = 0;
                            $scope.statistics.hasEmail = 0;
                            $scope.statistics.hasCookie = 0;
                            $scope.statistics.executionTimeInMs = 0;
                            $scope.statsError = "There was an error executing query";
                        });

                        $scope.results = [];

                        if (resultsTabSelected && $scope.statistics.total !== 0 && $scope.queryContainer.selectedValues.length !== 0) {
                            Restangular.one('datamarts', $scope.datamartId).customPOST(jsonQuery, 'query_executions/result_preview').then(function (results) {
                                $scope.results = results;
                            });
                        }
                    };

                    if ($scope.autoload && !$scope.queryId){
                        reload();
                    }

                    $scope.$on("mics-query-tool:refresh", function (event, params) {
                        reload();
                    });

                    $scope.$on("mics-query-tool:save", function (event, params) {
                        queryContainer.save().then(function success (){
                            $scope.$emit("mics-query-tool:save-complete", {queryId: queryContainer.id});
                        }, function failure(reason){
                            $scope.$emit("mics-query-tool:save-error", {reason: reason});
                        });

                    });

                    $scope.$on("mics-datamart-query:addProperty", function (event, params) {
                        fetchPropertySelectors();
                    });

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

                    $scope.addPropertySelector = function (family) {
                        var newScope = $scope.$new(true);
                        newScope.propertySelector = {
                            datamart_id: $scope.datamartId,
                            selector_family: family,
                            selector_name: 'CUSTOM_PROPERTY'
                        };
                        $modal.open({
                            templateUrl: 'src/core/datamart/queries/create-property-selector.html',
                            scope: newScope,
                            backdrop: 'static',
                            controller: 'core/datamart/queries/CreatePropertySelectorController'
                        });
                    };

                    $scope.toHumanReadableDuration = function (duration) {
                        return moment.duration(duration, 'ms').format("d [days] h [hours] m [minutes] s [seconds] S [ms]");
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

                },
                templateUrl: function (elem, attr) {
                    return 'src/core/datamart/queries/query-ui.html';
                }
            };
        }]);

    module.directive('mcsQueryCondition', [ 'core/datamart/queries/common/Common', function (Common) {
        return {
            restrict: 'E',
            scope: {
                // same as '=condition'
                condition: '='
            },
            controller: function ($scope) {
                $scope.operators = Common.propertySelectorOperators[$scope.condition.property_selector_value_type];

                $scope.initConditionValue = function (condition){
                  if (condition.operator === "BETWEEN" && condition.property_selector_value_type === "DATE"){
                      condition.value = {from:"", to:""};
                  } else {
                      condition.value = "";
                  }

                };
            },
            templateUrl: function (elem, attr) {
                return 'src/core/datamart/queries/condition.html';
            }
        };
    }]);

    module.directive('mcsQueryConditionValueTokenfield', function () {
        return {
            restrict: 'E',
            scope: {
                // same as '=condition'
                condition: '='
            },
            template: '<input type=\"search\" class=\"form-control tokenfield\" ng-model=\"tokens.values\">',
            link:function(scope, elem, attr){
                scope.tokens = {values:""};

                var tokenfieldInput = elem.find('.tokenfield');

                scope.$watch('tokens.values', function(newValue, oldValue){
                    if (oldValue){
                        var tokens = tokenfieldInput.tokenfield('getTokens');
                        scope.condition.value = tokens.map(
                            function(token){
                                return token.value;
                            }
                        );
                    }
                });

                tokenfieldInput.tokenfield({
                    tokens:scope.condition.value
                });

            }
        };
    });

    module.directive('mcsQueryConditionValueDateRange', [ 'moment',  function (moment) {
        return {
            restrict: 'E',
            scope: {
                // same as '=condition'
                condition: '='
            },
            templateUrl: 'src/core/datamart/queries/value-condition-type-date-range.html',
            link:function(scope, elem, attr){

                var fromDateInputField = elem.find('input[name="fromDateInputField"]');
                var toDateInputField = elem.find('input[name="toDateInputField"]');

                if (scope.condition.value.from && scope.condition.value.to){
                    scope.datefield = {
                        from:moment(scope.condition.value.from).format("L"),
                        to:moment(scope.condition.value.to).format("L")
                    };
                }else{
                    scope.datefield = {from:"",to:""};
                }


                fromDateInputField.daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    startDate: scope.datefield.from ? scope.datefield.from : moment(),
                    minDate: moment("1970-01-01"),
                    maxDate: moment().add(10,'y')
                },function (start, end, label) {
                    scope.condition.value.from = start.format();
                });

                toDateInputField.daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    startDate: scope.datefield.to ? scope.datefield.to : moment(),
                    minDate: moment("1970-01-01"),
                    maxDate: moment().add(10,'y')
                },function (start, end, label) {
                    scope.condition.value.to = start.format();
                });
            }
        };
    }]);

    module.directive('mcsQueryConditionValueSimpleDate', [ 'moment',  function (moment) {
        return {
            restrict: 'E',
            scope: {
                // same as '=condition'
                condition: '='
            },
            templateUrl: 'src/core/datamart/queries/value-condition-type-date-simple.html',
            link:function(scope, elem, attr){

                var datefieldInput = elem.find('input[name="simpleDateInputField"]');

                if (scope.condition.value){
                    scope.datefield = {date:moment(scope.condition.value).format("L")};
                }else{
                    scope.datefield = {date:""};
                }

                datefieldInput.daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    startDate: scope.datefield.date ? scope.datefield.date : moment(),
                    minDate: moment("1970-01-01"),
                    maxDate: moment().add(10,'y')
                },function (start, end, label) {
                    scope.condition.value = start.format();
                });
            }
        };
    }]);

    module.directive('mcsQueryConditionValueRelativeDate', [ 'moment',  function (moment) {

        function updateCondition(scope){
            var isoPeriod = "P" + scope.relativeDateNumber + scope.relativeDateMagnitude;
            scope.condition.value = isoPeriod;
        }

        return {
            restrict: 'E',
            scope: {
                // same as '=condition'
                condition: '='
            },
            templateUrl: 'src/core/datamart/queries/value-condition-type-relative-date.html',
            link:function(scope, elem, attr){

                scope.magnitudes = [
                    {label:"days", letter:"D"},
                    {label:"months", letter:"M"},
                    {label:"years", letter:"Y"}
                ];

                if (scope.condition.value){
                    scope.relativeDateNumber = scope.condition.value.charAt(1);
                    scope.relativeDateMagnitude = scope.condition.value.charAt(2);
                } else {
                    scope.relativeDateNumber = "";
                    scope.relativeDateMagnitude = "";
                }


                scope.$watch('relativeDateNumber', function(newValue, oldValue){
                    updateCondition(scope);
                });

                scope.$watch('relativeDateMagnitude', function(newValue, oldValue){
                    updateCondition(scope);
                });

            }
        };
    }]);

});
