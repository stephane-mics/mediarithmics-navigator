define(['./module', 'clipboard', 'jquery'], function (module, clipboard, $) {
  'use strict';

  module.controller('core/assets/ViewAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$state', '$stateParams', '$uibModal', '$log', 'core/configuration',
    function ($scope, Restangular, Session, $location, $state, $stateParams, $uibModal, $log, configuration) {
      $scope.organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.assetsUrl = configuration.ASSETS_URL;
      $scope.assets = [];
      $scope.adRenderers = [];
      $scope.adLayoutRendererVersions = [];
      $scope.listMode = true;

      $scope.uploadAssets = function () {
        var modal = $uibModal.open({
          templateUrl: 'src/core/assets/upload-asset.html',
          scope: $scope,
          backdrop: 'static',
          controller: 'core/assets/UploadAssetController',
          size: 'lg'
        });

        modal.result.then(function () {
          $scope.successMessage = "Your assets have been successfully uploaded.";
        });
      };

      Restangular.all("asset_files").getList({organisation_id: $scope.organisationId}).then(function (assets) {
        $scope.assets = assets;
      });

      $scope.printAssets = function() {
        $log.debug($scope.assets);
      };

      $scope.archive = function (assetId) {
        Restangular.one("asset_files", assetId).remove().then(function () {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
      };

      $scope.$on('plupload:uploaded', function () {
        $state.transitionTo($state.current, $stateParams, {
          reload: true, inherit: true, notify: true
        });
      });
    }
  ]);
});