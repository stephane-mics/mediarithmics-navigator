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
      $scope.newCreativesWrapper = [];


      $scope.logAssetDeletion = function (elt) {
        $log.debug("deleted asset", elt);
      };

      $scope.$watchCollection("uploadedFiles", function (newFiles) {
        while(newFiles.length) {
          var file = newFiles.pop();
          $log.info("got new uploaded file, pushing as asset", file);
          $scope.newCreativesWrapper.push({
            asset:file,
            creative:{
              name : file.original_filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
            },
            rendererProperties : []
          });
        }
      });

      function saveCreativeWrapper(userDefinedCreative) {

        var isFlash = userDefinedCreative.asset.mime_type === "application/x-shockwave-flash";

        var groupId = "com.mediarithmics.creative.display";
        var artifactId = "quick-image-banner";

        if (isFlash) {
          artifactId = "quick-flash-banner";
        }

        $log.debug("creating creative", userDefinedCreative);
        return Restangular.all("creatives").post({
          name : userDefinedCreative.creative.name,
          type : "DISPLAY_AD",
          format : userDefinedCreative.asset.width + "x" + userDefinedCreative.asset.height,
          template_group_id : groupId,
          template_artifact_id : artifactId
        }, {
          // query params
          organisation_id : Session.getCurrentWorkspace().organisation_id
        }).then(function (creative) {
          var rendererProperties = [];

          rendererProperties.push({
            "technical_name" : "destination_url",
            "value" : {"url":userDefinedCreative.creative.url_target}
          });

          if(isFlash) {
            rendererProperties.push({
              "technical_name" : "flash",
              "value": {"asset_id":userDefinedCreative.asset.id}
            });
          } else {
            rendererProperties.push({
              "technical_name" : "image",
              "value": {"asset_id":userDefinedCreative.asset.id}
            });
          }
          // the creative has been created but now we need to
          // update the renderer properties : the target url and the asset.
          Restangular.one("display_ads", creative.id).one("renderer_properties").customPUT(rendererProperties).then(function(returnedProperties) {
            $scope.$emit("mics-creative:new", {
              creative : creative,
              asset : userDefinedCreative.asset,
              rendererProperties : returnedProperties
            });
          }, function (reason) {
            $log.error("creative, set renderer_properties : fail, ", reason);
          });
        }, function (reason) {
          $log.error("create a new creative : fail, ", reason);
        });
      }

      $scope.done = function() {
        var wrapper = $scope.newCreativesWrapper;

        for (var i = 0; i < wrapper.length; i++) {
          saveCreativeWrapper(wrapper[i]);
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

