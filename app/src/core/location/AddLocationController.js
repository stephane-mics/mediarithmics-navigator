(function(){

  'use strict';

  var module = angular.module('core/location');

  module.controller("core/location/AddLocationController", [
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {

      $scope.addPostalCodeList = function () {
        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/location/postalcodes/AddPostalCodeList.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/location/postalcodes/AddPostalCodeListController'
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    }
  ]);
})();

