(function(){

  'use strict';

  var module = angular.module('core/adgroups');

  module.directive('micsListCreatives', [
    '$log', 'lodash', 'core/configuration',
    function($log, _, configuration) {
      return {
        // restrict: 'E',
        scope: {
          creatives: '=',
          externalOnDelete: '=onDelete',
          showDelete: "="
        },
        templateUrl: 'src/core/adgroups/ListCreatives.html',
        link: function (scope, iElement, iAttrs) {
          scope.showPreview = function (crea) {
            if (crea.mime_type === "application/x-shockwave-flash") {
              return "images/Adobe-swf_icon.png";
            } else {
              return configuration.ASSETS_URL + crea.file_path;
            }
          };
          scope.ASSETS_URL = configuration.ASSETS_URL;
          scope.onDelete = function (eltToDelete) {
            var idx = scope.creatives.indexOf(eltToDelete);
            if(idx === -1) {
              $log.warn("micsListCreatives: trying to delete an unknown elt", eltToDelete);
              return;
            }

            scope.creatives.splice(idx, 1);

            if (scope.externalOnDelete) {
              scope.externalOnDelete.call(null, eltToDelete);
            }
          };
        }
      };
    }
  ]);
})();

