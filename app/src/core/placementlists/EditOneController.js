(function(){

  'use strict';


  var module = angular.module('core/placementlists');

  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('core/placementlists/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$routeParams', '$location',
    function($scope, $log, Restangular, Session, _, $routeParams, $location) {
      var placementListId = $routeParams.placementlist_id;
      var type = $routeParams.type;

      $scope.isCreationMode = !placementListId;

      if (!placementListId) {
        $scope.placementList = {
          group_type : type
        };
      } else {
        Restangular.one('placement_lists', placementListId).get().then(function (placementList) {
          $scope.placementList = placementList;
        });
        Restangular.one('placement_lists', placementListId).all("generator_campaigns").getList().then(function (campaigns) {
          $scope.generatorCampains = campaigns;
        });
        Restangular.one('placement_lists', placementListId).all("consumer_campaigns").getList().then(function (campaigns) {
          $scope.consumerCampains = campaigns;
        });
      }

      $scope.goToCampaign = function (campaign) {
        switch(campaign.type) {
          case "DISPLAY":
            $location.path("/campaigns/display/report/" + campaign.id + "/basic");
            break;
          default:
            $location.path("/campaigns");
            break;
        }
      };

      $scope.cancel = function () {
        $location.path("/library/placementlists");
      };

      $scope.next = function () {
        var promise = null;
        if(placementListId) {
          promise = $scope.placementList.put();
        } else {
          promise = Restangular.all('placement_lists').post($scope.placementList, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        }
        promise.then(function success(campaignContainer){
          $log.info("success");
          $location.path("/library/placementlists");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
})();

