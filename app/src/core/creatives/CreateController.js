define(['./module'], function (module) {
  'use strict';

  module.controller('core/creatives/CreateController', [
    '$scope', '$location', '$log', 'core/common/auth/Session','core/creatives/CreativePluginService',

    function($scope, $location, $log, Session, CreativePluginService) {
      CreativePluginService.getAllCreativeTemplates().then(function (templates) {
        $scope.creativeTemplates = templates;
      });

      $scope.create = function (template) {
        var organisationId = Session.getCurrentWorkspace().organisation_id;
        var location = template.editor.create_path.replace(/{id}/g, "").replace(/{organisation_id}/, organisationId);
        $location.path(location);
      };

      $scope.cancel = function () {
        $location.path("/" + Session.getCurrentWorkspace().organisation_id + '/creatives');
      };
    }
  ]);
});
