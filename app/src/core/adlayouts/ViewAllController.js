define(['./module'], function (module) {

  'use strict';

  module.controller('core/adlayouts/ViewAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$state', '$stateParams',
    function ($scope, Restangular, Session, $location, $state, $stateParams) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.adLayouts = Restangular.all("ad_layouts").getList({organisation_id: organisationId}).$object;
      $scope.organisationId = organisationId;
    }
  ]);

});