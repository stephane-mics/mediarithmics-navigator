(function () {
  'use strict';

  var module = angular.module('core/creatives');

  /*
   * Creative list controller
   */

  module.controller('core/creatives/ListController', [
    '$scope', '$location', '$log', 'Restangular', 'core/creatives/DisplayAdService', 'core/common/auth/Session',

    function ($scope, $location, $log, Restangular,  DisplayAdService, Session) {
  
      $scope.organisationName = function (id ) { return Session.getOrganisationName(id);};
      $scope.administrator = Session.getCurrentWorkspace().administrator;

      var params = { organisation_id: Session.getCurrentWorkspace().organisation_id };
      if (Session.getCurrentWorkspace().administrator) {
        params = { administration_id: Session.getCurrentWorkspace().organisation_id };
      }

      Restangular.all('creatives').getList(params).then(function (creatives) {
        $scope.creatives = creatives;
      });

      $scope.newCreative = function () {
        $log.debug("> newCreative ");
        $location.path('/creatives/select-creative-template');
      };

      $scope.showCreative = function (creative) {
        $log.debug("> showCreative for creativeId=", creative.id);
        $location.path("/display-creatives/report/" + creative.id + "/basic");
      };

      $scope.editCreative = function (creative) {

        $log.debug("> editCreative for creativeId=", creative.id);

        // get creative edit template
        // this is hardcoded
        // todo : match the creative template with the editor
        var editTemplateView = 'display-ads/expert/edit/';

        DisplayAdService.initEditDisplayAd(creative.id).then(function () {
          $location.path(editTemplateView + creative.id);
        });


      };
    }
  ]);

})();
