define(['./module'], function () {
  'use strict';

  var module = angular.module('core/creatives');

  module.controller('core/creatives/CreateController', [
    '$scope', '$location', '$log', 'core/common/auth/Session','core/creatives/CreativeTemplateService', 'core/creatives/CreativePluginService',

    function($scope, $location, $log, Session, CreativeTemplateService, CreativePluginService) {
      CreativePluginService.getAllCreativeTemplates().then(function (templates) {
        $scope.creativeTemplates = templates;
      });

      // create button
      $scope.create = function(template) {
        var organisationId = Session.getCurrentWorkspace().organisation_id;
        var location = template.editor.create_path.replace(/{id}/g, "").replace(/{organisation_id}/, organisationId);
        $location.path(location);
      };

      $scope.cancel = function() {
        $location.path("/"+ Session.getCurrentWorkspace().organisation_id +'/creatives');
      };
    }
  ]);
});
