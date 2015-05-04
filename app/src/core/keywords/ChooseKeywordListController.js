define(['./module'], function (module) {

  'use strict';

  module.controller("core/keywords/ChooseKeywordListController", [
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {

      $scope.selectExistingKeywordList = function() {
        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/keywords/ChooseExistingKeywordList.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/keywords/ChooseExistingKeywordListController',
          size: "lg"
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    }
  ]);
});

