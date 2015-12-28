define(['./module'], function (module) {
  'use strict';

  module.controller('core/assets/UploadAssetController', [
    '$scope', '$log', 'core/common/auth/Session', 'core/configuration', '$uibModalInstance',
    function ($scope, $log, Session, configuration, $uibModalInstance) {
      $scope.url = null;
      $scope.assets = [];
      $scope.destination_domain = null;
      $scope.uploadedFiles = [];

      $scope.pluploadOptions = {
        multi_selection: true,
        url: configuration.ADS_UPLOAD_URL + "?organisation_id=" + Session.getCurrentWorkspace().organisation_id,
        filters: {
          mime_types: [
            {title: "Image files", extensions: "jpg,jpeg,png,gif"},
            {title: "Flash files", extensions: "swf"}
          ],
          max_file_size: "200kb"
        }
      };

      $scope.done = function () {
        if ($scope.assets.length) {
          $scope.$broadcast("plupload:upload", $scope.assets);
        } else {
          $uibModalInstance.close();
        }
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss(false);
      };

      $scope.printAssets = function() {
        $log.debug($scope.assets);
      };

      $scope.$on("plupload:uploaded", function () {
        $uibModalInstance.close(true);
      }, function () {
        $log.debug("Upload error");
      });
    }
  ]);
});