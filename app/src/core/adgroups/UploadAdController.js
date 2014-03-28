(function(){
  'use strict';

  /*
   * Display Campaign Template Module
   *
   * Template : Expert
   *
   *
   */

  var module = angular.module('core/adgroups');

  module.controller('core/adgroups/UploadAdController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService) {

      $log.debug('Init UploadAdController');

      $scope.done = function() {
        $modalInstance.close();
      };

      $modalInstance.opened.then(function(){


      });



    }
  ]);
})();

