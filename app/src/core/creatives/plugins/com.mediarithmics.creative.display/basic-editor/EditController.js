define(['./module', 'app'], function (module) {
  'use strict';

  module.controller('core/creatives/plugins/com.mediarithmics.creative.display/basic-editor/EditController', [

    '$scope', '$log', '$location', '$stateParams', 'core/creatives/DisplayAdService', 'core/common/auth/Session', 'core/creatives/CreativePluginService', '$controller', "core/common/ErrorService", '$state',

    function ($scope, $log, $location, $stateParams, DisplayAdService, Session, CreativePluginService, $controller, errorService, $state) {

      $controller('core/creatives/plugins/com.mediarithmics.creative.display/common/CommonEditController', {$scope: $scope});

      $scope.$on("display-ad:loaded", function () {
        // the parent controller has loaded the creative, you can use it now (check DisplayAdService)
        $log.info("display-ad:loaded");
      });


      $scope.propertiesFilter = function (property) {
        return property.value.technical_name === 'destination_url';
      };

      // save button
      $scope.save = function () {
        $log.debug("save display ad : ", $scope.display_ad);
        DisplayAdService.save().then(function (displayAdContainer) {
          $location.path('/' + Session.getCurrentWorkspace().organisation_id + '/creatives');
        }, function failure(response) {
          errorService.showErrorModal({
            error: response
          });
        });
      };

      // save button
      $scope.saveAndRefresh = function () {
        $log.debug("save display ad : ", $scope.display_ad);
        DisplayAdService.save().then(function (displayAdContainer) {
          // $state.reload();
          // see https://github.com/angular-ui/ui-router/issues/582
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        }, function failure(response) {
          errorService.showErrorModal({
            error: response
          });
        });
      };

      // back button
      $scope.cancel = function () {
        DisplayAdService.reset();
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + '/creatives');

      };


    }
  ]);

});

