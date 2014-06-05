(function(){
  'use strict';

  var module = angular.module('core/campaigns');

  module.controller('core/campaigns/DeleteController', [
    '$scope', '$modalInstance', '$location',
    function($scope, $modalInstance, $location) {

      $scope.done = function() {
        $scope.campaign.remove().then(function (){
        $modalInstance.close();
        $location.path("/");
        });
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
})();



