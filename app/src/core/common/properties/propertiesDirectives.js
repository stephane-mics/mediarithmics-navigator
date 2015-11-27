define(['./module'], function (module) {
  'use strict';

  // Pixel property
  module.directive('mcsPixelProperty', [
    function () {
      return {
        restrict: 'E',
        scope: {
          labelText: "@",
          labelFor: '@',
          property: '=',
          ngDisabled: '='
        },
        templateUrl: '/src/core/common/properties/pixel-property.html',
        link: function (scope, element, attrs) {

          scope.$watch("property", function () {
//            console.log(scope.property);
          });
        }
      };
    }
  ]);

  // Url property
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

  // Text property
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
        }
      };
    }
  ]);

  // Ad Layout property
  module.directive('mcsAdLayoutProperty', ['Restangular', '$uibModal',
    function (Restangular, $uibModal) {
      return {
        restrict: 'E',
        scope: {
          labelText: "@",
          labelFor: '@',
          property: '=',
          organisationId: '=',
          ngDisabled: '='
        },
        templateUrl: '/src/core/common/properties/ad-layout-property.html',
        link: function (scope, element, attrs) {
          Restangular.all("plugins").getList({plugin_type: "DISPLAY_AD_RENDERER"}).then(function (renderers) {
            scope.displayAdRenderers = [];
            for (var i = 0; i < renderers.length; ++i) {
              scope.displayAdRenderers[renderers[i].id] = renderers[i].artifact_id;
            }
          });

          scope.selectedAdLayout = {};

          if (scope.property.value.id) {
            Restangular.one("ad_layouts/" + scope.property.value.id).get({organisation_id: scope.organisationId}).then(function (adLayout) {
              Restangular.one("ad_layouts/" + scope.property.value.id + "/versions/" + scope.property.value.version)
                .get({organisation_id: scope.organisationId}).then(function (version) {
                  scope.selectedAdLayout = {adLayout: adLayout, version: version};
                });
            });
          }

          if (typeof scope.organisationId === 'undefined') {
            return console.warn("mcsAdLayoutProperty: Missing organisation id");
          }

          if (typeof scope.property === 'undefined') {
            return console.warn("mcsAdLayoutProperty: Property is undefined");
          }

          scope.selectAdLayout = function () {
            var modal = $uibModal.open({
              templateUrl: 'src/core/common/properties/ad-layout-select.html',
              scope: scope,
              backdrop: 'static',
              controller: 'core/common/properties/AdLayoutSelectController',
              size: 'lg',
              resolve: {
                propAdLayout: function () {
                  return scope.property.value
                },
                displayAdRenderers: function () {
                  return scope.displayAdRenderers
                }
              }
            });
            modal.result.then(function (selectedAdLayout) {
              if (selectedAdLayout) {
                scope.selectedAdLayout = selectedAdLayout;
                scope.property.value.id = selectedAdLayout.adLayout.id;
                scope.property.value.version = selectedAdLayout.version.id;
              }
            });
          };
        }
      }
    }
  ]);

  // Number property
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
