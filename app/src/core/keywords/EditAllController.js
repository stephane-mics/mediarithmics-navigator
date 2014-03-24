(function(){

  'use strict';

  var module = angular.module('core/keywords');

  // TODO
  module.controller('core/keywords/EditAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session',
    function($scope, Restangular, Session) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      Restangular.all('keyword_lists').getList({organisation_id: organisationId}).then(function (keywordsLists) {
        $scope.keywordsLists = keywordsLists;
      });

      $scope.addKeywordsList = function() {
        $scope.keywordsLists.push({
          expressionList : []
        });
      };
    }
  ]);

})();

