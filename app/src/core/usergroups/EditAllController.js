define(['./module'], function (module) {

  'use strict';

  module.controller('core/usergroups/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal',
    function($scope, Restangular, Session, $location, $modal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('user_groups').getList({organisation_id: organisationId}).then(function (userGroups) {
        $scope.userGroups = userGroups;
      });

      $scope.createUserGroup = function (type) {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/usergroups/" + type);
      };

      $scope.editUserGroup = function (userGroup, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/usergroups/" + userGroup.type + "/" + userGroup.id);
      };

      $scope.deleteUserGroup = function (userGroup, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        var newScope = $scope.$new(true);
        newScope.userGroup = userGroup;
        $modal.open({
          templateUrl: 'src/core/usergroups/delete.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/usergroups/DeleteController'
        });

        return false;
      };
    }
  ]);

});


