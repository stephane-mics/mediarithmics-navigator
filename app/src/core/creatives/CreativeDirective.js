(function () {
  'use strict';


  var module = angular.module('core/creative');
  module.directive('creativeThumbnail', ["Restangular", 'core/configuration',
    function (Restangular, configuration) {
//      var CreativeRestangular = Restangular.withConfig(
//        function (RestangularConfigurer) {
//          RestangularConfigurer.setDefaultHttpFields({cache: true});
//        });

      return {
        link: function (scope, element, attrs) {
          scope.$watch(attrs.creativeThumbnail, function (value) {
            if (!value) {
              return;
            }
            Restangular.one("creatives", value).one("thumbnail").get().then(
              function (creative) {
                if (creative.asset_path) {
                  attrs.$set("src", configuration.ASSETS_URL + creative.asset_path);
                } else if (creative.icon_id === "flash") {
                  attrs.$set("src", "images/Adobe-swf_icon.png");
                } else if (creative.icon_id === "image") {
                  attrs.$set("src", "images/Unknown_file.png");
                } else if (creative.url) {
                  attrs.$set("src", creative.url);
                }

              }
            ).catch(
              function (error) {
                attrs.$set("src", "images/Unknown_file.png");
              }
            );


          });
        }


      };
    }
  ]);

  module.directive('fetchCreative', [
    "Restangular",
    function (Restangular) {
//      var CreativeRestangular = Restangular.withConfig(
//        function (RestangularConfigurer) {
//          RestangularConfigurer.setDefaultHttpFields({cache: true});
//        });

      return {
        restrict: 'EA',
        transclude: 'element',
        compile: function (element, attr, linker) {
          return function ($scope, $element, $attr) {
            var asString = $attr.fetchCreative;
            //ad.creative_id as creative with rendererProperties
            var match = asString.match(/^\s*(.+)\s+as\s+(.*?)\s*(with\s*(.*))?$/);
            var creativeIdExpr = match[1];
            var exposedVar = match[2];
            var withRendererProperties = match[4] === "rendererProperties";

            var parent = $element.parent();
            $scope.$watch(creativeIdExpr, function (newValue, oldValue, scope) {
              if (newValue !== undefined) {
                var creative = Restangular.one("creatives", newValue);
                $scope[exposedVar] = creative.get().$object;
                if (withRendererProperties) {
                  Restangular.one("display_ads", newValue).all("renderer_properties").getList().then(
                    function (properties) {
                      var result = {};
                      for (var i = 0; i < properties.length; i++) {
                        var p = properties[i];
                        result[p.technical_name] = {value: p.value, property_type: p.property_type};
                      }
                      $scope[exposedVar + "Properties"] = result;
                    }
                  );
                }
              }
              linker($scope, function (clone) {
                // clone the transcluded element, passing in the new scope.
                parent.append(clone); // add to DOM
                var block = {};
                block.el = clone;
                block.scope = $scope;
//                elements.push(block);
              });

            });


          };
        }
      };
    }
  ]);

  module.filter('rendererProperty', function () {
    return function (input) {
      if (input === undefined) {
        return;
      }
      if (input.property_type === 'URL') {
        return input.value.url;
      }

      return "";
    };
  });


}());

