/* global _ */
define(['./module'], function (module) {
  'use strict';

  module.controller('core/creatives/plugins/video-ad/common/CommonEditController', [
    '$scope', '$sce', '$log', '$location', '$stateParams', 'core/creatives/plugins/video-ad/VideoAdService', 'core/common/auth/Session', 'core/creatives/CreativePluginService', 'core/configuration', '$state',
    function ($scope, $sce, $log, $location, $stateParams, VideoAdService, Session, CreativePluginService, configuration, $state) {

      var creativeId = $stateParams.creative_id;

      $scope.getRendererTitle = function (videoAd) {
        if (!videoAd) {
          return "";
        }
        return "Video";
      };

      $scope.doAction = function (action) {
        VideoAdService.makeAuditAction(action).then(function () {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
      };

      CreativePluginService.getCreativeTemplateFromEditor("video-ad", "video-editor").then(function (template) {
        $scope.creativeTemplate = template;
      });

      VideoAdService.initEditVideoAd(creativeId).then(function () {
        $scope.videoAd = VideoAdService.getVideoAdValue();
        $scope.properties = VideoAdService.getProperties();
        $scope.adServingUrl = VideoAdService.getAdServingUrl();
        $scope.audits = VideoAdService.getAudits();
        $scope.disabledEdition = $scope.videoAd.audit_status !== "NOT_AUDITED";
        VideoAdService.setVideoPlayerConfig($scope.adServingUrl, function (config) {
          $scope.videoPlayerConfig = config;
          $log.debug("Video Player Config:", $scope.videoPlayerConfig);
          $scope.videoWidth = $scope.videoPlayerConfig.plugins.ads.companionSize[0];
          $scope.videoHeight = $scope.videoPlayerConfig.plugins.ads.companionSize[1];
          $scope.videoAd.format = $scope.videoWidth + "x" + $scope.videoHeight;
          $log.debug("Format: ", $scope.videoWidth + "x" + $scope.videoHeight);
        });
        $scope.$emit("video-ad:loaded");
      });

    }
  ]);
});

