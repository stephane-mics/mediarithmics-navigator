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
          externalOnDelete: '=onDelete'
        },
        templateUrl: 'src/core/adgroups/ListCreatives.html',
        link: function (scope, iElement, iAttrs) {
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

