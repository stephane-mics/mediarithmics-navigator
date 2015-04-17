define(['./module'], function (module) {
  'use strict';

  module.controller("core/adgroups/ChooseAdsController", [
    "$scope", "$modal", "$log", "$q", "core/common/ads/AdService",
    function($scope, $modal, $log, $q, AdService) {

      $scope.setAdTypeToDisplayAd = function() {
        AdService.setAdTypeToDisplayAd();
      };

      $scope.setAdTypeToVideoAd = function() {
        AdService.setAdTypeToVideoAd();
      };

      // Upload new Ad
      $scope.uploadNewAd = function(adGroup) {
        // Display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/adgroups/upload-ad.html',
          scope: $scope,
          backdrop: 'static',
          controller: 'core/adgroups/UploadAdController'
        });
        uploadModal.result.then(function () {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      // Select existing Ads
      $scope.selectExistingAd = function(adGroup) {
        // Display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/adgroups/ChooseExistingAds.html',
          scope: $scope,
          backdrop: 'static',
          controller: 'core/adgroups/ChooseExistingAdsController',
          size: 'lg'
        });
        uploadModal.result.then(function () {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    }
  ]);
});
