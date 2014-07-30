define(['./module'], function () {
  'use strict';

  var module = angular.module('core/keywords');

  module.controller('core/keywords/DeleteController', [
    '$scope', '$modalInstance', '$location', '$route', 'core/common/auth/Session',
    function($scope, $modalInstance, $location, $route, Session) {

      $scope.done = function() {
        $scope.keywordsList.remove().then(function (){
          $modalInstance.close();
          $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/keywordslists");
          $route.reload();
        });
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});



