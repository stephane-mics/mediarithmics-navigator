(function(){
  'use strict';

  /*
   * Display Campaign Template Module
   *
   * Template : Expert
   *
   *
   */

  var module = angular.module('core/adgroups');

  module.controller('core/adgroups/UploadAdController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $log.debug('Init UploadAdController');

      // for the directive mics-pl-upload
      $scope.uploadedFiles = [];

      // for the page
      $scope.uploadedAsset = [];


      $scope.logAssetDeletion = function (elt) {
        $log.debug("deleted asset", elt);
      };

      $scope.$watchCollection("uploadedFiles", function (newFiles) {
        while(newFiles.length) {
          var file = newFiles.pop();
          $log.info("got new uploaded file, pushing as asset", file);
          file.name = file.original_filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
          $scope.uploadedAsset.push(file);
        }
      });

      function saveCreative(asset) {
        $log.debug("creating creative", asset);
        return Restangular.all("creatives").post({
          name : asset.name,
          type : "DISPLAY_AD",
          template_group_id : "com.mediarithmics.creative.display",
          // TODO : flash banners
          template_artifact_id : "quick-image-banner"
        }, {
          // query params
          organisation_id : Session.getCurrentWorkspace().organisation_id
        }).then(function (creative) {
          // the creative has been created but now we need to
          // update the renderer properties : the target url and the asset.
          Restangular.one("display_ads", creative.id).one("renderer_properties").customPUT([{
            "technical_name" : "destination_url",
            "value" : {"url":asset.url}
          },{
            "technical_name" : "image",
            "value": {"asset_id":asset.id}
          }]).then(function() {
            $scope.$emit("mics-creative:new", {
              creative : creative,
              asset : asset
            });
          }, function (reason) {
            $log.error("creative, set renderer_properties : fail, ", reason);
          });
        }, function (reason) {
          $log.error("create a new creative : fail, ", reason);
        });
      }

      $scope.done = function() {
        var assets = $scope.uploadedAsset;

        for (var i = 0; i < assets.length; i++) {
          saveCreative(assets[i]);
        }
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

      $modalInstance.opened.then(function(){


      });



    }
  ]);
})();

