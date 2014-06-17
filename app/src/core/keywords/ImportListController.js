(function(){

  'use strict';


  var module = angular.module('core/keywords');

  module.controller('core/keywords/ImportListController', [
    '$scope', '$modalInstance', '$document', '$log', "Restangular",
    function($scope, $modalInstance, $document, $log, Restangular) {

      $scope.done = function(deleteExisting, keywords) {
        $scope.$emit("mics-keywords-list:import", {
          keywords : (keywords||"").replace("\r", "").split("\n"),
          deleteExisting : deleteExisting,
          type : $scope.type
        });
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
})();

