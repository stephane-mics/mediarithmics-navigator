define(['./module'], function () {
  'use strict';
  var module = angular.module('core/common/properties');

  // url property
  module.directive('mcsUrlProperty', [
    function () {
      return {
        restrict: 'E',
        scope: {
          labelText: "@",
          labelFor: '@',
          property: "=property",
          ngDisabled: "="
        },
        templateUrl: '/src/core/common/properties/url-property.html',
        link: function (scope, ele, attrs, c) {

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
          property: '=property',
          ngDisabled: "="
        },
        controller: 'core/common/properties/AssetPropertyController',
        templateUrl: '/src/core/common/properties/asset-property.html',
        link: function (scope, ele, attrs, c) {

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
          property: '=property',
          ngDisabled: "="
        },
        templateUrl: '/src/core/common/properties/data-file-property.html',
        link: function (scope, ele, attrs, c) {

          scope.$watch("property", function () {
//            console.log(scope.property);
          });
        }
      };
    }
  ]);


});
