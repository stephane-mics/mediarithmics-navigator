define(['./module'], function (module) {
  'use strict';

  module.controller('core/adlayouts/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal',
    function ($scope, Restangular, Session, $location, $modal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('adlayouts').getList({organisation_id: organisationId}).then(function (adlayouts) {
        $scope.adlayouts = adlayouts;
      });

      $scope.createAdLayout = function () {
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/adLayouts/");
      };

      $scope.editAdLayout = function (scenario, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/adLayouts/" + scenario.id);
      };

      $scope.deleteAdLayout = function (scenario, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }
        var newScope = $scope.$new(true);
        newScope.scenario = scenario;
        $modal.open({
          templateUrl: 'src/core/adlayouts/delete.html',
          scope: newScope,
          backdrop: 'static',
          controller: 'core/adlayouts/DeleteController'
        });
        return false;
      };
    }
  ]);
});