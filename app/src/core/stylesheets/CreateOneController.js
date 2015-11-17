define(['./module', 'jquery'], function (module, $) {
  'use strict';

  module.controller('core/stylesheets/CreateOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', '$stateParams', '$location',
    function ($scope, $log, Restangular, Session, $stateParams, $location) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.organisationId = organisationId;
      $scope.stylesheet = {
        organisation_id: organisationId,
        current_version_id: 0
      };

      $scope.saveAndCreateNewVersion = function () {
        Restangular.all('style_sheets').post($scope.stylesheet).then(function (stylesheet) {
          $location.path("/" + organisationId + "/library/stylesheets/" + stylesheet.id + "/new-version");
        }, function (err) {
          $log.error("Couldn't create style sheet: ", err);
        });
      };

      $scope.done = function () {
        return Restangular.all('style_sheets').post($scope.stylesheet).then(function () {
          $location.path('/' + organisationId + "/library/stylesheets");
        }, function (err) {
          $log.error("Couldn't create style sheet: ", err);
        });
      };

      $scope.cancel = function () {
        $location.path('/' + organisationId + "/library/stylesheets");
      };
    }
  ]);
});