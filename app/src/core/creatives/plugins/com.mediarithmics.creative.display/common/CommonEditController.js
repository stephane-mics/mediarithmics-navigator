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

    '$scope', '$sce', '$log', '$location', '$stateParams', 'core/creatives/DisplayAdService', 'core/common/auth/Session', 'core/creatives/CreativePluginService', 'core/configuration', '$state',

    function ($scope, $sce, $log, $location, $stateParams, DisplayAdService, Session, CreativePluginService, configuration, $state) {

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

      $scope.doAction = function (action) {
        console.log(DisplayAdService.makeAuditAction);
        DisplayAdService.makeAuditAction(action).then(function () {
          // $state.reload();
          // see https://github.com/angular-ui/ui-router/issues/582
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
      };

      CreativePluginService.getCreativeTemplateFromEditor("com.mediarithmics.creative.display", "basic-editor").then(function (template) {
        $scope.creativeTemplate = template;
      });


      DisplayAdService.initEditDisplayAd(creativeId).then(function () {

        $scope.displayAd = DisplayAdService.getDisplayAdValue();
        $scope.properties = DisplayAdService.getProperties();
        $scope.audits = DisplayAdService.getAudits();

        $scope.disabledEdition = $scope.displayAd.audit_status !== "NOT_AUDITED";

        $scope.previewUrl = $sce.trustAsResourceUrl(configuration.ADS_PREVIEW_URL + "?ctx=PREVIEW&rid=" + $scope.displayAd.id +"&caid=preview");
        var sizes = $scope.displayAd.format.split("x");
        $scope.previewWidth = parseInt(sizes[0])+10;
        $scope.previewHeight = parseInt(sizes[1])+10;

        $scope.$emit("display-ad:loaded");
      });

    }
  ]);

});

