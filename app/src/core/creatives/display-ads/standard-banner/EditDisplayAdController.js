/* global _ */
define(['./module', 'app'], function () {
  'use strict';

  /*
   * Display Ad Template Module
   *
   * Template : Expert
   *
   *
   */


  var module = angular.module('core/creatives/display-ads/standard-banner');
                     
  module.controller('core/creatives/display-ads/standard-banner/EditDisplayAdController', [
    
    '$scope', '$sce', '$log', '$location', '$stateParams', 'core/creatives/DisplayAdService',

    function ($scope, $sce, $log, $location, $stateParams, DisplayAdService) {

      
      var creativeId = $stateParams.creative_id;


      
      $log.debug('standard-banner.EditDisplayAdController called !');
      
      
      /*
      if (!DisplayAdService.isInitialized() || DisplayAdService.getDisplayAdId() !== creativeId) {

        if (DisplayAdService.isTemporaryId(creativeId)) {
          DisplayAdService.initCreateDisplayAd().then(function () {
            initView();
          });
        } else {
          DisplayAdService.initEditDisplayAd(creativeId).then(function () {
            initView();
            DisplayAdService.loadProperties();
          });
        }
      } else {
        // init scope
        initView();
      }
      */
      
      DisplayAdService.initEditDisplayAd(creativeId).then(function () {

          $scope.displayAd = DisplayAdService.getDisplayAdValue();
          $scope.properties = DisplayAdService.getProperties();

          $log.debug('standard-banner.EditDisplayAdController, properties=', $scope.properties);

          $scope.previewUrl = $sce.trustAsResourceUrl("//ads.mediarithmics.com/ads/render?ctx=PREVIEW&rid=" + $scope.displayAd.id +"&caid=preview");
          var sizes = $scope.displayAd.format.split("x");
          $scope.previewWidth = parseInt(sizes[0])+10;
          $scope.previewHeight = parseInt(sizes[1])+10;
        });


      // save button
      $scope.save = function () {
        $log.debug("save display ad : ", $scope.display_ad);
        DisplayAdService.save().then(function (displayAdContainer) {
          $location.path('/' + Session.getCurrentWorkspace().organisation_id + '/creatives');
        });
      };

      // back button
      $scope.cancel = function () {
        DisplayAdService.reset();
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + '/creatives');

      };
    

    }
  ]);

});

