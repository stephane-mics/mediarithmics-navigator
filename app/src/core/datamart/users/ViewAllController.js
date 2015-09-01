define(['./module'], function (module) {

  'use strict';


  module.controller('core/datamart/users/ViewAllController', [
    '$scope', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session','$stateParams',
    function($scope, Restangular, Common, Session, $stateParams) {

      $scope.baseUrl = '#' + Common.locations.current.href;

      $scope.datamartId = Session.getCurrentDatamartId();

      $scope.myTimelineHref = "#/"+$stateParams.organisation_id +"/datamart/users/upid/my_user_point_id/live/true";

      $scope.searchTerms = {term:""};

      $scope.refreshUsers = function (offset, limit) {
        Restangular.one('datamarts', $scope.datamartId).all('user_profiles/search/').getList({ terms: $scope.searchTerms.term, offset: offset, limit: limit}).then(function (result) {
          $scope.users = result;
        });
      };

      // attach watcher
      $scope.refreshUsers(0, 10);

    }
  ]);

});
