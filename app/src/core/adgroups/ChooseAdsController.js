(function(){

  'use strict';

  var module = angular.module('core/adgroups');

  module.controller("core/adgroups/ChooseAdsController", [
    "$scope", "$modal", "$log",
    function($scope, $modal, $log) {
      // upload new Ad
      $scope.uploadNewAd = function(adGroup) {

        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/adgroups/upload-ad.html',
          scope : $scope,
          controller: 'core/adgroups/UploadAdController'
        });

        uploadModal.result.then(function () {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };


      // select exisiting Ads
      $scope.selectExistingAd = function(adGroup) {
        // display pop-up
      };
    }
  ]);
})();
