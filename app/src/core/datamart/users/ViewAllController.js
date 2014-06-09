(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.controller('core/datamart/users/ViewAllController', [
    '$scope', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session',
    function($scope, Restangular, Common, Session) {

      $scope.baseUrl = '#' + Common.locations.current.href;

      // TODO: get organisationId from session, get appropriate datamartId
      var workspace = Session.getCurrentWorkspace();
      if (workspace.organisation_id == "501") $scope.datamartId = 8;
      else $scope.datamartId = 0;

      $scope.refreshUsers = function (offset, limit) {
        Restangular.one('datamarts', $scope.datamartId).all('users/search/').getList({ terms: $scope.searchTerms, offset: offset, limit: limit}).then(function (result) {
          $scope.users = result;
        });
      };

      // attach watcher
      $scope.refreshUsers(0, 10);
      $scope.$watch('searchTerms', function(){
        $scope.refreshUsers(0, 10);
      });

    }
  ]);

})();