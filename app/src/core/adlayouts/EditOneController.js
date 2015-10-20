define(['./module'], function (module) {
  'use strict';

  module.controller('core/adlayouts/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$modal', '$stateParams', '$location', 'core/common/IabService', 'core/configuration',
    function ($scope, $log, Restangular, Session, _, $modal, $stateParams, $location, IabService, configuration) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.isCreationMode = !$stateParams.adlayout_id;
      $scope.adRenderers = [];
      $scope.adLayout = {};
      $scope.adSizes = _.map(IabService.getAdSizes("DISPLAY_AD"), function (size) {
        return size.format;
      });

      Restangular.all("plugins").getList({plugin_type: "DISPLAY_AD_RENDERER"}).then(function (renderers) {
        for (var i = 0; i < renderers.length; ++i) {
          $scope.adRenderers[renderers[i].artifact_id] = renderers[i].id;
        }
        $scope.adRendererVersions = [renderers[0].current_version_id];
        $scope.adLayout = {
          format: "300x250",
          adRenderer: renderers[0].id,
          adRendererVersion: renderers[0].current_version_id
        };
      });

      $scope.$watch("adLayout.adRenderer", function (rendererId) {
        if (rendererId) {
          Restangular.all("plugins/" + rendererId + "/versions").getList().then(function (versions) {
            $scope.adRendererVersions = [];
            for (var i = 0; i < versions.length; ++i) {
              $scope.adRendererVersions.push(versions[i].id);
            }
            $scope.adLayout.adRendererVersion = versions[0].id;
          });
        }
      });

      $scope.pluploadOptions = {
        url: configuration.WS_URL + "/ad_templates?organisationId=" + organisationId,
        chunks_size: '100kb',
        filters: {
          mime_types: [
            {title: "Ad Layout Templates", extensions: "ssp"}
          ],
          max_file_size: "100kb"
        }
      };

      $scope.done = function () {
      };

      $scope.cancel = function () {
        $location.path('/' + organisationId + "/library/adlayouts");
      };
    }
  ])
  ;
})
;