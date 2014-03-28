(function(){

  'use strict';


  var module = angular.module('core/keywords');

  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('core/keywords/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session',
    function($scope, $log, Restangular, Session) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;

      $scope.keywordsList = $scope.keywordsList || {
        expressionList : []
      };

      $scope.newKeywordExpression = {
        content : "",
        type : "include"
      };

      $scope.negativeExpressionsFilter = function (expression) {
        return expression.type === "exclude";
      };

      $scope.positiveExpressionsFilter = function (expression) {
        return expression.type === "include";
      };

      $scope.refreshStats = function () {
        $log.log("refreshStats has not been implemented yet");
      };

      $scope.addKeywordExpression = function (kw, newKeywordExpression) {
        if (!newKeywordExpression.content) {
          return;
        }

        var found = false, current;
        for (var i = 0; i < kw.expressionList.length; i++) {
          current = kw.expressionList[i];
          if (current.content === newKeywordExpression.content) {
            found = true;
            break;
          }
        }

        if(!found) {
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
})();
