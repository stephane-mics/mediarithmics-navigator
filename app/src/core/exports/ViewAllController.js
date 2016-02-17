define(['./module'], function (module) {

  'use strict';

  module.controller('core/exports/ViewAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$uibModal',
    function($scope, Restangular, Session, $location, $uibModal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('exports').getList({organisation_id: organisationId}).then(function (exports) {
        $scope.exports = exports;
      });

      $scope.organisationId = organisationId;
    }
  ]);

});


