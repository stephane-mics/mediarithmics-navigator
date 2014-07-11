define(['./module.js'], function () {
  'use strict';

  /*
   * Asset Property Field controller
   *
   */

  var module = angular.module('core/common/properties');

  module.controller('core/common/properties/AssetPropertyController', [
    '$scope', '$modal', '$log',

    function($scope, $modal, $log) {

      // upload an asset
      $scope.uploadAsset = function() {

        $log.debug("open upload asset modal window ");

        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/common/properties/asset-upload.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/common/properties/AssetUploadController'
        });

        uploadModal.result.then(function (assetValue) {

          if (typeof(assetValue) !== "undefined") {
            $log.debug('asset upload result =', assetValue);
            $scope.property.value = assetValue;
          }

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      // view file
      $scope.viewFile = function() {
        $log.debug("view file");
      };

    }]);  

});