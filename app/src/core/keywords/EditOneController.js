define(['./module.js'], function () {

  'use strict';


  var module = angular.module('core/keywords');

  module.controller('core/keywords/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$modal', '$routeParams', 'core/keywords/KeywordListContainer', '$location',
    function($scope, $log, Restangular, Session, _, $modal, $routeParams, KeywordListContainer, $location) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;

      var keywordslistId = $routeParams.keywordslist_id;

      $scope.isCreationMode = !keywordslistId;

      $scope.keywordsList = new KeywordListContainer();
      if (keywordslistId) {
        $scope.keywordsList.load(keywordslistId);
      }

      $scope.cancel = function () {
        $location.path("/library/keywordslists");
      };

      $scope.next = function () {
        var promise = $scope.keywordsList.save();
        promise.then(function success(keywordListContainer){
          $log.info("success");
          $location.path("/library/keywordslists");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
});

