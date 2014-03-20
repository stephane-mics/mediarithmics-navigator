(function(){

  'use strict';

  var module = angular.module('keywords/controller', []);

  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('keywords/controller/edit.one', [
    '$scope', 'Restangular', 'Session',
    function($scope, Restangular, Session) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;

      $scope.keywordsList = {
        expressionList : []
      };

      $scope.newKeywordExpression = {
        content : "",
        type : "include"
      };

      $scope.addKeywordExpression = function (kw, newKeywordExpression) {
        if (!newKeywordExpression.content) {
          return;
        }

        var idx = kw.expressionList.indexOf(newKeywordExpression.content);
        if(idx === -1) {
          kw.expressionList.push({
            content : newKeywordExpression.content,
            type : newKeywordExpression.type
          });
          newKeywordExpression.content = "";
        }
      };

      $scope.removeKeywordExpression = function(kw, keywordExpression) {
        var idx = kw.expressionList.indexOf(keywordExpression);
        kw.expressionList.splice(idx, 1);
      };
    }
  ]);

  // TODO
  module.controller('keywords/controller/edit.all', [
    '$scope', 'Restangular', 'Session',
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
