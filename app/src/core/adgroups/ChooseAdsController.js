define(['./module'], function () {

  'use strict';

  var module = angular.module('core/adgroups');

  module.controller("core/adgroups/ChooseAdsController", [
    "$scope", "$modal", "$log", "$q",
    function($scope, $modal, $log, $q) {
      // upload new Ad
      $scope.uploadNewAd = function(adGroup) {

        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'src/core/adgroups/upload-ad.html',
          scope : $scope,
          backdrop : 'static',
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
        var uploadModal = $modal.open({
          templateUrl: 'src/core/adgroups/ChooseExistingAds.html',
          scope : $scope,
          backdrop : 'static',
          controller: 'core/adgroups/ChooseExistingAdsController',
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
