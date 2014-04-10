(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.controller('core/datamart/users/ViewAllController', [
    '$scope', 'Restangular', 'core/datamart/common/Common',
    function($scope, Restangular, Common) {

      $scope.baseUrl = '#' + Common.locations.current.href;

      // TODO: get organisationId from session, get appropriate datamartId
      $scope.datamartId = 8;

      $scope.refreshUsers = function (offset, limit) {
        Restangular.one('datamarts', $scope.datamartId).one('users/search/').get({ terms: $scope.searchTerms, offset: offset, limit: limit}).then(function (result) {
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