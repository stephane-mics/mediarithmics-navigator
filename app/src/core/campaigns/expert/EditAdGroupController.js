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

  module.controller('core/campaigns/expert/EditAdGroupController', [
    '$scope', '$location', '$routeParams', '$modal', '$log', 'core/campaigns/DisplayCampaignService',
    function($scope, $location, $routeParams, $modal, $log, DisplayCampaignService) {

      var adGroupId = $routeParams.ad_group_id;

      $scope.campaignName = DisplayCampaignService.getCampaignValue().name;

      // get campaign
      $scope.adGroup = DisplayCampaignService.getAdGroupValue($routeParams.ad_group_id);

      // fo the keywords controller
      // $scope.keywordsList =

      // save button
      $scope.done = function() {

        $log.debug("Editing Ad Group done! :", $scope.adGroup);

        DisplayCampaignService.setAdGroupValue(adGroupId, $scope.adGroup);
        $location.path('/display-campaigns/expert/edit-campaign/'+DisplayCampaignService.getCampaignId());

      };


      // back button
      $scope.cancel = function() {

        $log.debug("Reset Ad Group");

        DisplayCampaignService.resetAdGroup(adGroupId);

        //DisplayCampaignService.resetAdGroupValue();
        $location.path('/display-campaigns/expert/edit-campaign/'+DisplayCampaignService.getCampaignId());

      };

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
$log.debug("Error", args);
});

$scope.uploader.bind('PostInit', function (up, params) {
$log.debug('Init plupload, params = ' + params);
});

$scope.uploader.init();
*/
    }
  ]);

})();

