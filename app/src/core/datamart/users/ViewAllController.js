define(['./module'], function (module) {

  'use strict';


  module.controller('core/datamart/users/ViewAllController', [
    '$scope', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session','$stateParams',
    function($scope, Restangular, Common, Session, $stateParams) {

      $scope.baseUrl = '#' + Common.locations.current.href;

      $scope.datamartId = Session.getCurrentDatamartId();

      if (Session.cookies && Session.cookies.mics_vidX){
        $scope.myTimelineHref = "#/"+$stateParams.organisation_id +"/datamart/users/user_agent_id/vec:" + Session.cookies.mics_vid + "?live=true";
      }

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
