define(['./module'], function (module) {
  'use strict';

  module.controller('core/creatives/plugins/display-ad/basic-editor/CreateController', [
    '$scope', '$location', 'core/common/auth/Session', 'core/creatives/CreativePluginService',
    function ($scope, $location, Session, CreativePluginService) {

      $scope.canSave = false;

      CreativePluginService.getCreativeTemplateFromEditor("com.mediarithmics.creative.display", "basic-editor").then(function (template) {
        $scope.creativeTemplate = template;
      });


      $scope.done = function () {
        $scope.$broadcast("display-ad/basic-editor:save");
      };

      $scope.$on("display-ad/basic-editor:saved", function () {
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/creatives");
      });

      $scope.$on("display-ad/basic-editor:asset-added", function () {
        $scope.canSave = true;
      });

      $scope.cancel = function () {
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/creatives");
      };

    }
  ]);
});

