define(['./module'], function () {
  'use strict';

  /*
   * User Settings Controller
   *   
   */

  var module = angular.module('core/usersettings');

  module.controller('core/usersettings/EditUserSettingsController', [
    '$scope', '$location', '$stateParams', '$modal', '$log', 'Restangular', 'lodash', 'core/common/auth/Session',

    function($scope, $location, $stateParams, $modal, $log, Restangular, _, Session) {

      var userProfile = Session.getUserProfile();

      $log.info(userProfile);

      $scope.userSettings = {
          first_name : userProfile.first_name,
          last_name : userProfile.last_name,
          email : userProfile.email,
          language : userProfile.language,
      };



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

      // save action
      $scope.save = function () {
        $log.debug("save user settings : ", $scope.userSettings);

        var promise = Restangular.one('users').customPUT($scope.userSettings, userProfile.id);
        
        promise.then(function success(response) {

          // update the sessions service
          Session.updateProfile(userSettings)

        }, function failure(response) {
          errorService.showErrorModal({
            error: response
          }).then(null, function (){
            
          });
        });

      };

      // Back / Cancel action
      $scope.cancel = function () {
          window.history.back();        

      };




    }
  ]);

});

