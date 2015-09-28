define(['./module'], function (module) {

  'use strict';


  module.controller('core/usergroups/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location',
    function($scope, $log, Restangular, Session, _, $stateParams, $location) {
      var userGroupId = $stateParams.usergroup_id;
      var type = $stateParams.type;

      $scope.isCreationMode = !userGroupId;

      if (!userGroupId) {
        $scope.userGroup = {
          type : type
        };
      } else {
        Restangular.one('user_groups', userGroupId).get().then(function (userGroup) {
          $scope.userGroup = userGroup;
        });
        Restangular.one('user_groups', userGroupId).all("generator_campaigns").getList().then(function (campaigns) {
          $scope.generatorCampains = campaigns;
        });
        Restangular.one('user_groups', userGroupId).all("consumer_campaigns").getList().then(function (campaigns) {
          $scope.consumerCampains = campaigns;
        });
      }

      $scope.goToCampaign = function (campaign) {
        switch(campaign.type) {
          case "DISPLAY":
            $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/campaigns/display/report/" + campaign.id + "/basic");
            break;
          default:
            $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/campaigns/display");
            break;
        }
      };

      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/usergroups");
      };

      $scope.next = function () {
        var promise = null;
        if(userGroupId) {
          promise = $scope.userGroup.put();
        } else {
          promise = Restangular.all('user_groups').post($scope.userGroup, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        }
        promise.then(function success(campaignContainer){
          $log.info("success");
          $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/usergroups");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
});

