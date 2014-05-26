(function(){

  'use strict';

  var module = angular.module('core/keywords');

  module.controller("core/keywords/ChooseKeywordListController", [
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {

      $scope.selectExistingKeywordList = function() {
        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/keywords/ChooseExistingKeywordList.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/keywords/ChooseExistingKeywordListController'
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    }
  ]);
})();

