define(['./module.js'], function () {

  'use strict';

  var module = angular.module('core/adgroups');

  module.directive('micsAssetThumbnail', [
    '$log', 'lodash', 'core/configuration',
    function($log, _, configuration) {
      return {
        // restrict: 'E',
        scope: {
          asset: '='
        },
        templateUrl: 'src/core/adgroups/AssetThumbnail.html',
        link: function (scope, iElement, iAttrs) {
          scope.showPreview = function (asset) {
            if (asset.mime_type === "application/x-shockwave-flash") {
              return "images/Adobe-swf_icon.png";
            } else {
              return configuration.ASSETS_URL + asset.file_path;
            }
          };
          scope.ASSETS_URL = configuration.ASSETS_URL;
        }
      };
    }
  ]);
});


