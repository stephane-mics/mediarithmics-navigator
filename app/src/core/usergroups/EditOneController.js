(function(){

  'use strict';


  var module = angular.module('core/usergroups');

  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('core/usergroups/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$routeParams', '$location',
    function($scope, $log, Restangular, Session, _, $routeParams, $location) {
      var userGroupId = $routeParams.usergroup_id;
      var type = $routeParams.type;

      $scope.isCreationMode = !userGroupId;

      if (!userGroupId) {
        $scope.userGroup = {
          group_type : type
        };
      } else {
        $scope.userGroup = Restangular.one('user_groups', userGroupId).get().then(function (userGroup) {
          $scope.userGroup = userGroup;
        });
      }

      $scope.cancel = function () {
        $location.path("/library/usergroups");
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
          $location.path("/library/usergroups");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
})();

