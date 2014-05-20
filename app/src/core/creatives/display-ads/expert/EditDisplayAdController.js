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

  var module = angular.module('core/creatives/display_ads/expert');

  module.controller('core/creatives/display_ads/expert/EditDisplayAdController', [
    '$scope', '$log', '$location', '$routeParams', 'core/creatives/DisplayAdService',

    function ($scope, $log, $location, $routeParams, DisplayAdService) {
      var creativeId = $routeParams.creative_id;

      function initView() {
        $scope.display_ad = DisplayAdService.getCreativeValue();
      }

      $log.debug('Expert.EditDisplayAdController called !');

      // TODO oad the campaign (no effect if already in cache or if this is a temporary id)
      if (!DisplayAdService.isInitialized() || DisplayAdService.getDisplayAdId() !== creativeId) {
        if (DisplayAdService.isTemporaryId(creativeId)) {
          DisplayAdService.initCreateDisplayAd("expert").then(function () {
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


      /*
       * Display Ad Edition
       */

      // save button
      $scope.save = function () {
        $log.debug("save display ad : ", $scope.display_ad;
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

