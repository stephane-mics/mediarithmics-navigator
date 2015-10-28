define(['./module'], function (module) {
  'use strict';

  module.controller('core/adlayouts/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$modal', '$stateParams', '$location', 'core/common/IabService', 'core/configuration',
    function ($scope, $log, Restangular, Session, _, $modal, $stateParams, $location, IabService, configuration) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.isCreationMode = !$stateParams.adlayout_id;
      $scope.adRenderers = [];
      $scope.adLayout = {organisation_id: organisationId, current_version_id: 0};
      $scope.adLayoutVersion = {
        organisation_id: organisationId,
        template: "mics://data_file/tenants/" + organisationId + "/ads_templates/",
        version_id: "1.0.0",
        status: "DRAFT"
      };
      $scope.files = [];
      $scope.adSizes = _.map(IabService.getAdSizes("DISPLAY_AD"), function (size) {
        return size.format;
      });

      Restangular.all("plugins").getList({plugin_type: "DISPLAY_AD_RENDERER"}).then(function (renderers) {
        for (var i = 0; i < renderers.length; ++i) {
          $scope.adRenderers[renderers[i].artifact_id] = renderers[i].id;
        }
        $scope.adRendererVersions = [renderers[0].current_version_id];
        $.extend($scope.adLayout, {
          format: "300x250",
          renderer_id: renderers[0].id,
          renderer_version_id: renderers[0].current_version_id
        });
      });

      $scope.$watch("adLayout.renderer_id", function (rendererId) {
        if (rendererId) {
          Restangular.all("plugins/" + rendererId + "/versions").getList().then(function (versions) {
            $scope.adRendererVersions = [];
            for (var i = 0; i < versions.length; ++i) {
              $scope.adRendererVersions.push(versions[i].id);
            }
            $scope.adLayout.renderer_version_id = versions[0].id;
          });
        }
      });

      $scope.pluploadOptions = {
        url: configuration.WS_URL + "/ad_templates?organisation_id=" + organisationId,
        chunks_size: '100kb',
        filters: {
          mime_types: [
            {title: "Ad Layout Templates", extensions: "ssp"}
          ],
          max_file_size: "100kb"
        },
        multipart_params: {names: $scope.adLayoutVersion.name}
      };

      $scope.done = function () {
        $scope.adLayout.format = "F" + $scope.adLayout.format;
        Restangular.all('ad_layouts').post($scope.adLayout).then(function (adLayout) {
          $scope.adLayoutVersion.ad_layout_id = adLayout.id;
          Restangular.all('ad_layouts/' + adLayout.id + '/versions').post($scope.adLayoutVersion).then(function (adLayoutVersion) {
            Restangular.all('ad_layouts/' + adLayout.id + '/current_version/' + adLayoutVersion.id).customPUT({}, undefined, {organisation_id: organisationId}).then(function () {
              $scope.$broadcast("adlayout:upload", {adLayoutId: adLayout.id, adLayoutVersionId: adLayoutVersion.id});
            });
          });
        });
      };

      $scope.$on("plupload:uploaded", function () {
        $location.path('/' + organisationId + "/library/adlayouts");
      });

      $scope.cancel = function () {
        $location.path('/' + organisationId + "/library/adlayouts");
      };
    }
  ]);
});