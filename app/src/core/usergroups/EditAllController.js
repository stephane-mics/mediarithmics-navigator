(function(){

  'use strict';

  var module = angular.module('core/usergroups');

  module.controller('core/usergroups/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal',
    function($scope, Restangular, Session, $location, $modal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('user_groups').getList({organisation_id: organisationId}).then(function (userGroups) {
        $scope.userGroups = userGroups;
      });

      $scope.createUserGroup = function (type) {
        $location.path("/library/usergroups/" + type);
      };

      $scope.editUserGroup = function (userGroup, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path("/library/usergroups/" + userGroup.group_type + "/" + userGroup.id);
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

})();


