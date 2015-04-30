define(['./module'], function (module) {
  'use strict';

  // url property
  module.directive('mcsUrlProperty', [
    function () {
      return {
        restrict: 'E',
        scope: {
          labelText: "@",
          labelFor: '@',
          property: '=',
          ngDisabled: '='
        },
        templateUrl: '/src/core/common/properties/url-property.html',
        link: function (scope, element, attrs) {

          scope.$watch("property", function () {
//            console.log(scope.property);
          });
        }
      };
    }
  ]);

  // text property
  module.directive('mcsTextProperty', [
    function () {
      return {
        restrict: 'E',
        scope: {
          labelText: "@",
          labelFor: '@',
          property: '=',
          ngDisabled: '='
        },
        templateUrl: '/src/core/common/properties/text-property.html',
        link: function (scope, element, attrs) {

          scope.$watch("property", function () {
//            console.log(scope.property);
          });
        }
      };
    }
  ]);

  // text property
  module.directive('mcsNumberProperty', [
    function () {
      return {
        restrict: 'E',
        scope: {
          labelText: "@",
          labelFor: '@',
          property: '=',
          ngDisabled: '='
        },
        templateUrl: '/src/core/common/properties/number-property.html',
        link: function (scope, element, attrs) {

          scope.$watch("property", function () {
//            console.log(scope.property);
          });
        }
      };
    }
  ]);

  // asset property
  module.directive('mcsAssetProperty', [
    function () {
      return {
        restrict: 'E',
        scope: {
          labelText: '@',
          labelFor: '@',
          property: '=',
          ngDisabled: '='
        },
        controller: 'core/common/properties/AssetPropertyController',
        templateUrl: '/src/core/common/properties/asset-property.html',
        link: function (scope, element, attrs) {

          scope.$watch("property", function () {
//            console.log(scope.property);
          });
        }
      };
    }
  ]);

  // data file property
  module.directive('mcsDataFileProperty', [
    function () {
      return {
        restrict: 'E',
        scope: {
          labelText: '@',
          labelFor: '@',
          property: '=',
          ngDisabled: '='
        },
        templateUrl: '/src/core/common/properties/data-file-property.html',
        link: function (scope, element, attrs) {

          scope.$watch("property", function () {
//            console.log(scope.property);
          });
        }
      };
    }
  ]);

// double property
  module.directive('mcsDoubleProperty', [
    function () {
      return {
        restrict: 'E',
        scope: {
          labelText: '@',
          labelFor: '@',
          property: '=',
          ngDisabled: '='
        },
        templateUrl: '/src/core/common/properties/double-property.html',
        link: function (scope, element, attrs) {

          scope.$watch("property", function () {
//            console.log(scope.property);
          });
        }
      };
    }
  ]);


});
