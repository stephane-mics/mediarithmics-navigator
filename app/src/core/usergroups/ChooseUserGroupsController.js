define(['./module.js'], function () {

  'use strict';

  var module = angular.module('core/usergroups');

  module.controller("core/usergroups/ChooseUserGroupsController", [
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {

      $scope.selectExistingUserGroups = function() {
        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/usergroups/ChooseExistingUserGroups.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/usergroups/ChooseExistingUserGroupsController'
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    }
  ]);
});
