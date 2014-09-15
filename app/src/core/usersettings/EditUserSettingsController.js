define(['./module'], function () {
  'use strict';

  /*
   * User Settings Controller
   *   
   */

  var module = angular.module('core/usersettings');

  module.controller('core/usersettings/EditUserSettingsController', [
    '$scope', '$location', '$stateParams', '$modal', '$log', 'lodash', 'core/common/auth/Session',

    function($scope, $location, $stateParams, $modal, $log, _, Session) {

      var userProfile = Session.getUserProfile();

      $log.info(userProfile)

      $scope.firstName = userProfile.first_name;
      $scope.lastName = userProfile.last_name;


      // change password event listener
      $scope.changePassword = function() {

        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/usersettings/change-password.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/usersettings/ChangePasswordController'
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    }
  ]);

});

