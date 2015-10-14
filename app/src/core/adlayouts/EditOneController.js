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

//curl -X PUT http://api.mediarithmics.com/v1/data_file/data\?uri\=mics%3A%2F%2Fdata_file%2Ftenants%2F1029%2Fads_templates%2Fpmb_pretargeting_160x600_septembre.ssp
// -H  "Authorization: gkqKkunjyV6AXZKvnnTjovGE6NrpTy7A"  -H "Content-Type: application/json"
// --data @dist/ssp_prod/pmb_pretargeting_160x600.ssp -v

      //console.log("here: ",  Restangular.one('data_file/data').customPUT({'uri': 'hello'}).getRestangularUrl());



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
        multi_selection: true,
        url: configuration.WS_URL + "/data_file/data?uri=" + encodeURIComponent("mics://data_file/tenants/" + organisationId + "/ads_templates/"),
        filters: {
          mime_types: [
            {title: "Ad Layout Templates", extensions: "ssp"}
          ],
          max_file_size: "100kb"
        }
      };

      $scope.uploadTemplate = function () {

      };

      $scope.cancel = function () {
        $location.path('/' + organisationId + "/library/adlayouts");
      };
    }
  ]);
});