define(['./module', 'jquery'], function (module, $) {
  'use strict';

  module.controller('core/adlayouts/CreateOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$uibModal', '$stateParams', '$location', 'core/common/IabService',
    function ($scope, $log, Restangular, Session, _, $uibModal, $stateParams, $location, IabService) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.organisationId = organisationId;
      $scope.adSizes = _.map(IabService.getAdSizes("DISPLAY_AD"), function (size) {
        return size.format;
      });
      $scope.adLayout = {
        organisation_id: organisationId
      };

      // Get list of ad renderers
      Restangular.all("plugins").getList({plugin_type: "DISPLAY_AD_RENDERER"}).then(function (renderers) {
        $scope.adRenderers = [];
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
              $scope.adRendererVersions[versions[i].version_id] = versions[i].id;
            }
            $scope.adLayout.renderer_version_id = versions[0].id;
          });
        }
      });

      $scope.saveAndCreateNewVersion = function () {
        $scope.adLayout.format = "F" + $scope.adLayout.format;
        Restangular.all('ad_layouts').post($scope.adLayout).then(function (adLayout) {
          $location.path("/" + organisationId + "/library/adlayouts/" + adLayout.id + "/new-version");
        }, function (err) {
          $log.error("Couldn't create ad layout: ", err);
        });
      };

      $scope.done = function () {
        $scope.adLayout.format = "F" + $scope.adLayout.format;
        return Restangular.all('ad_layouts').post($scope.adLayout).then(function () {
          $location.path('/' + organisationId + "/library/adlayouts");
        }, function (err) {
          $log.error("Couldn't create ad layout: ", err);
        });
      };

      $scope.cancel = function () {
        $location.path('/' + organisationId + "/library/adlayouts");
      };
    }
  ]);
});