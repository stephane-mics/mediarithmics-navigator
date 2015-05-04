define(['./module', 'app'], function (module) {
  'use strict';

  module.controller('core/creatives/plugins/display-ad/default-editor/EditController', [
    '$scope', '$log', '$location', '$stateParams', 'core/creatives/plugins/display-ad/DisplayAdService', 'core/common/auth/Session', 'core/creatives/CreativePluginService','$controller', "core/common/ErrorService", '$state', 'core/common/IabService', 'lodash',
    function ($scope, $log, $location, $stateParams, DisplayAdService, Session, CreativePluginService, $controller, errorService, $state, IabService, _) {

      $controller('core/creatives/plugins/display-ad/common/CommonEditController', {$scope: $scope});

      $scope.$on("display-ad:loaded", function () {
        // The parent controller has loaded the creative, you can use it now (check DisplayAdService)
        $log.info("display-ad:loaded");
        $scope.iabAdSizes = _.map(IabService.getAdSizes($scope.displayAd.subtype), function (size) {
          return size.format;
        });
      });

      $scope.propertiesFilter = function (property) {
        return property.value.technical_name === 'destination_url';
      };

      // Save button
      $scope.save = function () {
        DisplayAdService.save().then(function (displayAdContainer) {
          $location.path('/' + Session.getCurrentWorkspace().organisation_id + '/creatives');
        }, function failure(response) {
          errorService.showErrorModal({
            error: response
          });
        });
      };

      // Save button
      $scope.saveAndRefresh = function () {
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

