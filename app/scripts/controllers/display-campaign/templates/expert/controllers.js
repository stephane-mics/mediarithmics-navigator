'use strict';

/*
 * Display Campaign Template Module
 *
 * Template : Expert
 * 
 *  
 */

var expertTemplate = angular.module('expertDisplayCampaignTemplate', ['displayCampaignService', 'ui.bootstrap', "keywords"]);

expertTemplate.controller('Expert.EditCampaignController', ['$scope', '$location', '$routeParams', 'DisplayCampaignService',

    function($scope, $location, $routeParams, DisplayCampaignService) {

      console.debug('Expert.EditCampaignController called !');

      // TODO oad the campaign (no effect if already in cache or if this is a temporary id)

      // init scope
      $scope.campaign = DisplayCampaignService.getCampaignValue();      
      $scope.adGroups = DisplayCampaignService.getAdGroupValues();
            
      console.debug('Expert.EditCampaignController adGroups=', $scope.adGroups);

      /*
       * Ad Group Edition
       */

      // new Ad Group
      $scope.newAdGroup = function () {
        var adGroupId = DisplayCampaignService.addAdGroup();
        $location.path('/display-campaigns/expert/edit-ad-group/'+adGroupId);
      }

      // edit Ad Group
      $scope.editAdGroup = function (adGroup) {
        $location.path('/display-campaigns/expert/edit-ad-group/'+adGroup.id);
      }




      /* 
       * Campaign Edition
       */ 

      // save button
      $scope.save = function() {      
        console.debug("save campaign : ", $scope.campaign);
        DisplayCampaignService.save().then(function() {
          $location.path('/display-campaigns');
        });
      }

      // back button
      $scope.cancel = function() {
        DisplayCampaignService.reset();
        $location.path('/display-campaigns');

      }
   	 
   		
   	}]);

expertTemplate.controller('Expert.EditAdGroupController', ['$scope', '$location', '$routeParams', '$modal', '$log', 'DisplayCampaignService', 

    function($scope, $location, $routeParams, $modal, $log, DisplayCampaignService) {

      var adGroupId = $routeParams.ad_group_id;

      $scope.campaignName = DisplayCampaignService.getCampaignValue().name;

      // get campaign
      $scope.adGroup = DisplayCampaignService.getAdGroupValue($routeParams.ad_group_id);      
     

      // upload new Ad
      $scope.uploadNewAd = function(adGroup) {

        // display pop-up
        var uploadModal = $modal.open({
          templateUrl: 'views/display-campaigns/templates/expert/upload-ad.html',
          scope : $scope,
          controller: 'Expert.UploadAdController'         
        });

        uploadModal.result.then(function () {
            
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });        
      }
      

      // select exisiting Ads
      $scope.selectExistingAd = function(adGroup) {
        // display pop-up

      }


      // save button
      $scope.done = function() {      

        console.debug("Editing Ad Group done! :", $scope.adGroup);
        
        DisplayCampaignService.setAdGroupValue(adGroupId, $scope.adGroup);
        $location.path('/display-campaigns/expert/edit-campaign/'+DisplayCampaignService.getCampaignId());
        
      }


      // back button
      $scope.cancel = function() {

        console.debug("Reset Ad Group");

        DisplayCampaignService.resetAdGroup(adGroupId);

        //DisplayCampaignService.resetAdGroupValue();
        $location.path('/display-campaigns/expert/edit-campaign/'+DisplayCampaignService.getCampaignId());

      }     

      /*
      $scope.uploader = new plupload.Uploader({
        runtimes:'html5,flash,html4',
        browse_button: 'browse',
        container: 'uploadContainer',
        url: "/upload/",
        flash_swf_url: 'bower_components/plupload/Moxie.swf',
        silverlight_xap_url: 'bower_components/js/external/plupload/Moxie.xap',
        filters : {
          max_file_size : '200kb',
          mime_types: [
            {title : "Image files", extensions : "jpg,png"},
            {title : "Flash files", extensions : "swf"}
          ]
        }
      });

      $scope.uploader.bind('Error', function (up, args) {
          console.debug("Error", args);
      });      

      $scope.uploader.bind('PostInit', function (up, params) {
          console.debug('Init plupload, params = ' + params);
      });

      $scope.uploader.init();
    */
}]);


expertTemplate.controller('Expert.UploadAdController', ['$scope', '$modalInstance', '$document', '$log', 'DisplayCampaignService', 

    function($scope, $modalInstance, $log, $document, DisplayCampaignService) {

      console.debug('Init UploadAdController');

      $scope.done = function() {
        $modalInstance.close()
      }

      $modalInstance.opened.then(function(){


      });

     

    }
]);
