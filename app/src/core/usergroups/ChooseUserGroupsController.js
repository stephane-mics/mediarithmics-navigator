define(['./module'], function (module) {

  'use strict';

  module.controller("core/usergroups/ChooseUserGroupsController", [
    "$scope", "$uibModal", "$log",
    function($scope, $uibModal, $log) {

      $scope.selectExistingUserGroups = function() {
        // display pop-up
        var uploadModal = $uibModal.open({
          templateUrl: 'src/core/usergroups/ChooseExistingUserGroups.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/usergroups/ChooseExistingUserGroupsController',
          size: "lg"
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    }
  ]);
});
