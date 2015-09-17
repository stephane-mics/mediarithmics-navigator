define(['./module'], function (module) {

    'use strict';

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
