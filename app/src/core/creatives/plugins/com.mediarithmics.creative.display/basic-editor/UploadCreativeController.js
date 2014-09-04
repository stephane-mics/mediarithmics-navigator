define(['./module'], function (module) {
  'use strict';

  module.controller('core/creatives/plugins/com.mediarithmics.creative.display/basic-editor/UploadCreativeController', [
    '$scope', '$document', '$log', "Restangular", 'core/common/auth/Session', 'core/configuration', 'lodash', '$q',
    function($scope, $document, $log, Restangular, Session, configuration, _, $q) {

      $log.debug('Init UploadAdController');

      // for the directive mics-pl-upload
      $scope.uploadedFiles = [];

      // for the page
      $scope.newCreativesWrapper = [];


      $scope.logAssetDeletion = function (elt) {
        $log.debug("deleted asset", elt);
      };

      $scope.pluploadOptions = {
        multi_selection: true,
        url : configuration.ADS_UPLOAD_URL + "?organisation_id=" + Session.getCurrentWorkspace().organisation_id,
        filters : {
          mime_types: [
            {title : "Image files", extensions : "jpg,jpeg,png,gif"},
            {title : "Flash files", extensions : "swf"}
          ],
          max_file_size: "200kb"
        }
      };

      $scope.$watchCollection("uploadedFiles", function (newFiles) {
        while(newFiles.length) {
          var file = newFiles.pop();
          $log.info("got new uploaded file, pushing as asset", file);
          $scope.$emit("com.mediarithmics.creative.display/basic-editor:asset-added");
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

        var renderer = {
          groupId : "com.mediarithmics.creative.display",
          artifactId : "image-iframe"
        };
        var editor = {
          groupId : "com.mediarithmics.creative.display",
          artifactId : "basic-editor"
        };

        if (isFlash) {
          renderer.artifactId = "flash-iframe";
        }

        $log.debug("creating creative", userDefinedCreative);
        return Restangular.all("creatives").post({
          name : userDefinedCreative.creative.name,
          type : "DISPLAY_AD",
          format : userDefinedCreative.asset.width + "x" + userDefinedCreative.asset.height,
          renderer_group_id : renderer.groupId,
          renderer_artifact_id : renderer.artifactId,
          editor_group_id : editor.groupId,
          editor_artifact_id : editor.artifactId
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
          return Restangular.one("display_ads", creative.id).one("renderer_properties").customPUT(rendererProperties).then(function(returnedProperties) {
            $scope.$emit("mics-creative:selected", {
              creative : creative
            });
          }, function (reason) {
            $log.error("creative, set renderer_properties : fail, ", reason);
          });
        }, function (reason) {
          $log.error("create a new creative : fail, ", reason);
        });
      }

      $scope.$on("com.mediarithmics.creative.display/basic-editor:save", function save() {
        var promises = _.map($scope.newCreativesWrapper, saveCreativeWrapper);

        $q.all(promises).then(function () {
          $scope.$emit("com.mediarithmics.creative.display/basic-editor:saved");
        }, function (error) {
          $scope.$emit("com.mediarithmics.creative.display/basic-editor:error", error);
        });
      });
    }
  ]);
});

