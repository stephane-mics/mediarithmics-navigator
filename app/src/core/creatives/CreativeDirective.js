(function () {
  'use strict';


  var module = angular.module('core/creative');
  module.directive('creativeThumbnail', [
    "Restangular",
    function (Restangular) {
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
            attrs.$set("src", "http://www.flaticon.com/png/256/12380.png");

            // on IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
            // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
            // to set the property as well to achieve the desired effect.
            // we use attr[attrName] value since $set can sanitize the url.
//            if (msie) {
//              element.prop("src", attrs["src"]);
//            }
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
            var match = asString.match(/^\s*(.+)\s+as\s+(.*?)\s*$/);
            var creativeIdExpr = match[1];
            var exposedVar = match[2];
            var parent = $element.parent();
            $scope.$watch(creativeIdExpr, function (newValue, oldValue, scope) {
              if (newValue !== undefined) {
                $scope[exposedVar] = Restangular.one("creatives", newValue).get().$object;
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


}());

