(function(){
  'use strict';

  /*
   * Asset Property
   *
   * Asset file upload controller
   *   
   */

  var module = angular.module('core/common/properties');


  module.controller('core/common/properties/AssetUploadController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',


    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $log.debug('Init AssetUploadController');

      // for the directive mics-pl-upload
      $scope.uploadedFiles = [];

      // for the page
      $scope.assetFiles = [];

      $scope.logAssetDeletion = function (elt) {
        $log.debug("deleted asset", elt);
      };

      $scope.$watchCollection("uploadedFiles", function (newFiles) {
        while(newFiles.length) {
          var file = newFiles.pop();
          $log.info("got new uploaded file, pushing as asset", file);
          $scope.assetFiles.push(file);
        }
      });

      

      $scope.done = function() {
        var assetValue = {};
        var file = $scope.assetFiles[0];
        assetValue.asset_id = file.id;
        assetValue.original_file_name = file.original_filename;

        $modalInstance.close(assetValue);
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

      $modalInstance.opened.then(function(){


      });



    }
  ]);
})();

