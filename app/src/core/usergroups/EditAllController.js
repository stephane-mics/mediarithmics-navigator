(function(){

  'use strict';

  var module = angular.module('core/usergroups');

  module.controller('core/usergroups/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session',
    function($scope, Restangular, Session) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('user_groups').getList({organisation_id: organisationId}).then(function (userGroups) {
        $scope.userGroups = userGroups;
      });
    }
  ]);

})();


