define(['./module'], function () {
  'use strict';

  var module = angular.module('core/usergroups');

  module.controller('core/usergroups/ChooseExistingUserGroupsController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $scope.availableUserGroups = Restangular.all("user_groups").getList({
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedUserGroups = [];

      $scope.done = function() {
        var usergroup;
        for (var i = 0; i < $scope.selectedUserGroups.length; i++) {
          usergroup = $scope.selectedUserGroups[i];
          $scope.$emit("mics-user-group:selected", {
            usergroup : usergroup,
            exclude : usergroup.exclude // TODO use a wrapper ?
          });
        }
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});

