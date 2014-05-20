/* global _ */
(function () {
  'use strict';

  /*
   * Display Ad Template Module
   *
   * Template : Expert
   *
   *
   */

  //console.debug("core/creatives/display-ads/standard-banner CREATED !")

  var module = angular.module('core/creatives/display-ads/standard-banner');
                     
  module.controller('core/creatives/display-ads/standard-banner/EditDisplayAdController', [

    '$scope', '$log', '$location', '$routeParams', 'core/creatives/DisplayAdService',

    function ($scope, $log, $location, $routeParams, DisplayAdService) {

      var creativeId = $routeParams.creative_id;


      function initView() {
        $scope.display_ad = DisplayAdService.getDisplayAdValue();
      }

      $log.debug('Expert.EditDisplayAdController called !');

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
          initView();
          DisplayAdService.loadProperties();
        });


      /*
       * Display Ad Edition
       */

      // save button
      $scope.save = function () {
        $log.debug("save display ad : ", $scope.display_ad);
        DisplayAdService.save().then(function (displayAdContainer) {
          $location.path('/creatives');
        });
      };

      // back button
      $scope.cancel = function () {
        DisplayAdService.reset();
        $location.path('/creatives');

      };


    }
  ]);

})();

