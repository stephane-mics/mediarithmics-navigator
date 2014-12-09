define(['./module'], function (module) {

  'use strict';


  module.controller('core/datamart/users/ViewAllController', [
    '$scope', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session',
    function($scope, Restangular, Common, Session) {

      $scope.baseUrl = '#' + Common.locations.current.href;

      $scope.datamartId = Session.getCurrentDatamartId();

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

});
