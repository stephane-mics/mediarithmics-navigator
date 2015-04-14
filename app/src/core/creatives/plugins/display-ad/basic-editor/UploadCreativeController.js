define(['./module'], function (module) {
  'use strict';

  module.controller('core/creatives/plugins/display-ad/basic-editor/UploadCreativeController', [
    '$scope', '$document', '$log', "Restangular", 'core/common/auth/Session', 'core/configuration', 'lodash', '$q', "core/creatives/plugins/display-ad/DisplayAdService", "core/common/ErrorService",
    function ($scope, $document, $log, Restangular, Session, configuration, _, $q, DisplayAdService, errorService) {

      $log.debug('Init UploadAdController');

      // For the directive mics-pl-upload
      $scope.uploadedFiles = [];

      // For the page
      $scope.newCreativesWrapper = [];

      $scope.logAssetDeletion = function (elt) {
        $log.debug("deleted asset", elt);
      };

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

      $scope.$watchCollection("uploadedFiles", function (newFiles) {
        while (newFiles.length) {
          var file = newFiles.pop();
          $log.info("got new uploaded file, pushing as asset", file);
          $scope.newCreativesWrapper.push({
            asset: file,
            creative: {
              name: file.original_filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
            },
            rendererProperties: []
          });
          $scope.$emit("display-ad/basic-editor:asset-added");
        }
      });

      function saveCreativeWrapper(userDefinedCreative) {
        var isFlash = userDefinedCreative.asset.mime_type === "application/x-shockwave-flash";
        var options = {
          renderer: {
            groupId: "com.mediarithmics.creative.display",
            artifactId: "image-iframe"
          },
          editor: {
            groupId: "com.mediarithmics.creative.display",
            artifactId: "basic-editor"
          }
        };
        if (isFlash) {
          options.renderer.artifactId = "flash-iframe";
        }
        var creativeContainer = DisplayAdService.initCreateDisplayAd(options);

        creativeContainer.value.name = userDefinedCreative.creative.name;
        creativeContainer.value.format = userDefinedCreative.asset.width + "x" + userDefinedCreative.asset.height;
        creativeContainer.value.subtype = "BANNER";
        creativeContainer.getOrCreatePropertyValueByTechnicalName("destination_url").value = {"url": userDefinedCreative.creative.url_target};
        if (isFlash) {
          creativeContainer.getOrCreatePropertyValueByTechnicalName("flash").value = {"asset_id": userDefinedCreative.asset.id};
        } else {
          creativeContainer.getOrCreatePropertyValueByTechnicalName("image").value = {"asset_id": userDefinedCreative.asset.id};
        }

        $log.debug("Creating creative: ", userDefinedCreative);
        return creativeContainer.persist().then(function success() {
          $log.warn("emit mics-creative:selected", creativeContainer.value);
          $scope.$emit("mics-creative:selected", {creative: creativeContainer});
        }, function failure(response) {
          errorService.showErrorModal({error: response});
        });
      }

      $scope.$on("display-ad/basic-editor:save", function save() {
        var promises = _.map($scope.newCreativesWrapper, saveCreativeWrapper);

        $q.all(promises).then(function () {
          $scope.$emit("display-ad/basic-editor:saved");
        }, function (error) {
          $scope.$emit("display-ad/basic-editor:error", error);
        });
      });
    }
  ]);
});

