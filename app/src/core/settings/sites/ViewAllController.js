define(['./module'], function (module) {
  'use strict';

  module.controller('core/settings/sites/ViewAllController', [
    '$scope', '$log', '$location', '$state', '$stateParams', 'Restangular', 'core/common/auth/Session', 'lodash',
    function ($scope, $log, $location, $state, $stateParams, Restangular, Session, _) {
      $scope.datamartId = Session.getCurrentDatamartId();
      $scope.organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.itemsPerPage = 20;
      $scope.currentPageCreative = 0;

      $scope.$watchGroup(["datamartId", "organisationId"], function (values) {
        if (values) {
          Restangular.all("datamarts/" + $scope.datamartId + "/sites").getList({"organisation_id": $scope.organisationId}).then(function(sites) {
            $scope.sites = sites;
          });
        }
      });

      $scope.edit = function(site) {
        $location.path("/" + $scope.organisationId + "/settings/sites/edit/" + site.id);
      };

      $scope.new = function() {
        $location.path("/" + $scope.organisationId + "/settings/sites/new");
      };

      $scope.archive = function(site) {
        Restangular.all("datamarts/" + $scope.datamartId + "/sites/" + site.id).remove({"organisation_id": $scope.organisationId}).then(function() {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
      };
    }
  ]);
});
