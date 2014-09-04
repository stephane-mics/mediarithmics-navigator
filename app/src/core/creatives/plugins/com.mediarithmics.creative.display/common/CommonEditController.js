/* global _ */
define(['./module', 'app'], function (module) {
  'use strict';

  /*
   * Display Ad Template Module
   *
   * common controller
   *
   *
   */

  module.controller('core/creatives/plugins/com.mediarithmics.creative.display/common/CommonEditController', [

    '$scope', '$sce', '$log', '$location', '$stateParams', 'core/creatives/DisplayAdService', 'core/common/auth/Session', 'core/creatives/CreativePluginService',

    function ($scope, $sce, $log, $location, $stateParams, DisplayAdService, Session, CreativePluginService) {


      var creativeId = $stateParams.creative_id;

      $scope.getRendererTitle = function (displayAd) {
        if (!displayAd) {
          return "";
        }

        switch (displayAd.renderer_group_id + "/" + displayAd.renderer_artifact_id) {
          case "com.mediarithmics.creative.display/image-iframe":
            return "Image Banner";
          case "com.mediarithmics.creative.display/flash-iframe":
            return "Flash Banner";
          default:
            return "";
        }
      };

      CreativePluginService.getCreativeTemplateFromEditor("com.mediarithmics.creative.display", "basic-editor").then(function (template) {
        $scope.creativeTemplate = template;
      });


      DisplayAdService.initEditDisplayAd(creativeId).then(function () {

        $scope.displayAd = DisplayAdService.getDisplayAdValue();
        $scope.properties = DisplayAdService.getProperties();

        $scope.previewUrl = $sce.trustAsResourceUrl("//ads.mediarithmics.com/ads/render?ctx=PREVIEW&rid=" + $scope.displayAd.id +"&caid=preview");
        var sizes = $scope.displayAd.format.split("x");
        $scope.previewWidth = parseInt(sizes[0])+10;
        $scope.previewHeight = parseInt(sizes[1])+10;

        $scope.$emit("display-ad:loaded");
      });

    }
  ]);

});

