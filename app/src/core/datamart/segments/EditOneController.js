define(['./module'], function (module) {

  'use strict';


  module.controller('core/datamart/segments/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location',
    function($scope, $log, Restangular, Session, _, $stateParams, $location) {
      var segmentId = $stateParams.segment_id;
      var type = $stateParams.type;

      $scope.isCreationMode = !segmentId;

      if (!segmentId) {
        $scope.segment = {
          type : type
        };
      } else {
        Restangular.one('audience_segments', segmentId).get().then(function (segment) {
          $scope.userGroup = segment;
        });

      }

      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/datamart/segments");
      };

      $scope.next = function () {
        var promise = null;
        if(segmentId) {
          promise = $scope.segment.put();
        } else {
          promise = Restangular.all('audience_segments').post($scope.segment, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        }
        promise.then(function success(){
          $log.info("success");
          $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/datamart/segments");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
});

