define(['./module'], function () {

  'use strict';

  /**
   * Fetch the renderer properties for a given display ad id and transform
   * it into a hash technical_name => {value/property_type}
   *
   * @param {Restangular} Restangular the Restangular object (yay dependency injection...)
   * @param {$q} $q the $q object (yay dependency injection...)
   * @param {String} displayAdId the id of the display ad.
   * @return {$q.promise} the promise of the result.
   */
  function fetchRendererProperties(Restangular, $q, displayAdId) {
    return Restangular
      .one("display_ads", displayAdId)
      .all("renderer_properties")
      .getList()
      .then(function (properties) {
        var deferred = $q.defer();
        var result = {};
        for (var i = 0; i < properties.length; i++) {
          var p = properties[i];
          result[p.technical_name] = {value: p.value, property_type: p.property_type};
        }
        deferred.resolve(result);
        return deferred.promise;
      });
  }

  var module = angular.module('core/creatives');
  module.directive('creativeThumbnail', ["Restangular", 'core/configuration', '$q',
    function (Restangular, configuration, $q) {

      return {
        link: function (scope, element, attrs) {
          scope.$watch(attrs.creativeThumbnail, function (value) {
            if (!value) {
              return;
            }
            Restangular.one("creatives", value).one("thumbnail").get().then(
              function (creative) {
                var format = scope.$eval(attrs.creativeFormat);

                if (creative.asset_path) {
                  attrs.$set("src", configuration.ASSETS_URL + creative.asset_path);
                } else if (creative.icon_id === "flash") {
                  if (format) {
                    attrs.$set("src", "images/flash/generated/Adobe-swf_icon_" + format + ".png");
                  } else {
                    attrs.$set("src", "images/flash/Adobe-swf_icon.png");
                  }
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

  module.directive('fetchDisplayAdRendererProperties', [
    "Restangular", "$q",
    function (Restangular, $q) {
      return {
        restrict: 'EA',
        controller: [
          "$scope",
          function ($scope) {
            this.setup = function (fetchDisplayAdRendererProperties) {
              var asString = fetchDisplayAdRendererProperties;
              //ad.creative_id as creative with rendererProperties
              var match = asString.match(/^\s*(.+)\s+as\s+(.*?)\s*$/);
              var creativeIdExpr = match[1];
              var exposedVar = match[2];
              $scope.$watch(creativeIdExpr, function (newValue, oldValue, scope) {
                if (!newValue) {
                  return;
                }
                fetchRendererProperties(Restangular, $q, newValue).then(function (result) {
                  $scope[exposedVar] = result;
                });
              });
            };
          }
        ],
        link: function (scope, element, attrs, myCtrl) {
          myCtrl.setup(attrs.fetchDisplayAdRendererProperties);
        }
      };
    }
  ]);

  module.directive('fetchCreative', [
    "Restangular", "$q",
    function (Restangular, $q) {
//      var CreativeRestangular = Restangular.withConfig(
//        function (RestangularConfigurer) {
//          RestangularConfigurer.setDefaultHttpFields({cache: true});
//        });

      return {
        restrict: 'EA',
        controller: [
          "$scope",
          function ($scope) {
            this.setup = function (fetchCreative) {
              var asString = fetchCreative;
              //ad.creative_id as creative with rendererProperties
              var match = asString.match(/^\s*(.+)\s+as\s+(.*?)\s*(with\s*(.*))?$/);
              var creativeIdExpr = match[1];
              var exposedVar = match[2];
              var withRendererProperties = match[4] === "rendererProperties";
              $scope.$watch(creativeIdExpr, function (newValue, oldValue, scope) {
                if (!newValue) {
                  return;
                }
                var creative = Restangular.one("creatives", newValue);
                $scope[exposedVar] = creative.get().$object;
                if (withRendererProperties) {
                  fetchRendererProperties(Restangular, $q, newValue).then(function (result) {
                    $scope[exposedVar + "Properties"] = result;
                  });
                }
              });
            };
          }
        ],
        link: function (scope, element, attrs, myCtrl) {
          myCtrl.setup(attrs.fetchCreative);
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
});

