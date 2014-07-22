define(['./module'], function () {

  'use strict';

  var module = angular.module('core/keywords');

  // TODO
  module.controller('core/keywords/ViewAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$modal',
    function($scope, Restangular, Session, $location, $modal) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('keyword_lists').getList({organisation_id: organisationId}).then(function (keywordsLists) {
        $scope.keywordsLists = keywordsLists;
      });


      $scope.organisationId = organisationId;

      $scope.editKeywordsList = function (keywordsList, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        $location.path( '/' + organisationId + "/library/keywordslists/" + keywordsList.id);
      };

      $scope.deleteKeywordsList = function (keywordsList, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        var newScope = $scope.$new(true);
        newScope.keywordsList = keywordsList;
        $modal.open({
          templateUrl: 'src/core/keywords/delete.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/keywords/DeleteController'
        });

        return false;
      };
    }
  ]);

});

