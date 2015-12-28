define(['./module'], function (module) {
  'use strict';

  module.directive('micsListNewAssets', ['$log', 'lodash', 'core/configuration',
    function ($log, _, configuration) {
      return {
        scope: {
          assets: "=",
          showDelete: "="
        },
        templateUrl: 'src/core/assets/list-new-assets.html',
        link: function (scope, elem, attrs) {
          scope.ADS_UPLOAD_URL = configuration.ADS_UPLOAD_URL;

          scope.delete = function (asset) {
            var idx = scope.assets.indexOf(asset);
            if (idx === -1) {
              $log.warn("micsListNewAssets: Trying to delete an unknown asset", asset);
              return;
            }
            scope.assets.splice(idx, 1);
          };
        }
      };
    }
  ]);
});

