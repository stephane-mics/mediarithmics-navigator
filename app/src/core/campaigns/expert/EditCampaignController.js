(function(){
  'use strict';

  /*
   * Display Campaign Template Module
   *
   * Template : Expert
   *
   *
   */

  var module = angular.module('core/campaigns/expert');

  module.controller('core/campaigns/expert/EditCampaignController', [
    '$scope', '$log', '$location', '$routeParams', 'core/campaigns/DisplayCampaignService',
    function($scope, $log, $location, $routeParams, DisplayCampaignService) {

      $log.debug('Expert.EditCampaignController called !');

      // TODO oad the campaign (no effect if already in cache or if this is a temporary id)

      // init scope
      $scope.campaign = DisplayCampaignService.getCampaignValue();
      $scope.adGroups = DisplayCampaignService.getAdGroupValues();

      $log.debug('Expert.EditCampaignController adGroups=', $scope.adGroups);

      /*
       * Ad Group Edition
       */

      // new Ad Group
      $scope.newAdGroup = function () {
        var adGroupId = DisplayCampaignService.addAdGroup();
        $location.path('/display-campaigns/expert/edit-ad-group/'+adGroupId);
      };

      // edit Ad Group
      $scope.editAdGroup = function (adGroup) {
        $location.path('/display-campaigns/expert/edit-ad-group/'+adGroup.id);
      };




      /*
       * Campaign Edition
       */

      // save button
      $scope.save = function() {
        $log.debug("save campaign : ", $scope.campaign);
        DisplayCampaignService.save().then(function() {
          $location.path('/display-campaigns');
        });
      };

      // back button
      $scope.cancel = function() {
        DisplayCampaignService.reset();
        $location.path('/display-campaigns');

      };


    }
  ]);
})();

