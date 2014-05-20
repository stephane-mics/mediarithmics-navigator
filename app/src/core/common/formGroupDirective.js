(function () {
  'use strict';
  var module = angular.module('core/common');
  module.directive('mcsFormGroup', [
    function () {
      return {
        restrict: 'EA',
        transclude: true,
        scope: {
          labelText: "@",
          labelFor: '@',
          formGroupType: "@mcsFormGroup"
        },
        templateUrl: '/src/core/common/formGroupDirective.html',
        replace: true
      };
    }
  ]);
}());
