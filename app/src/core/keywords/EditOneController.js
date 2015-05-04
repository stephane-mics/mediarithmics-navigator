define(['./module'], function (module) {

  'use strict';


  module.controller('core/keywords/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$modal', '$stateParams', 'core/keywords/KeywordListContainer', '$location',
    function($scope, $log, Restangular, Session, _, $modal, $stateParams, KeywordListContainer, $location) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;

      var keywordslistId = $stateParams.keywordslist_id;

      $scope.isCreationMode = !keywordslistId;

      $scope.keywordsList = new KeywordListContainer();
      if (keywordslistId) {
        $scope.keywordsList.load(keywordslistId);
      }

      $scope.cancel = function () {
        $location.path( '/' + organisationId + "/library/keywordslists");
      };

      $scope.next = function () {
        var promise = $scope.keywordsList.save();
        promise.then(function success(keywordListContainer){
          $log.info("success");
          $location.path( '/' + organisationId + "/library/keywordslists");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
});

