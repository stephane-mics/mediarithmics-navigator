(function(){

  'use strict';


  var module = angular.module('core/keywords');

  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('core/keywords/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash',
    function($scope, $log, Restangular, Session, _) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;

      // $scope.keywordsList is a KeywordListContainer

      $scope.newKeywordExpression = {
        expression : "",
        type : "include"
      };

      $scope.negativeExpressionsFilter = function (expression) {
        return expression.exclude === true;
      };

      $scope.positiveExpressionsFilter = function (expression) {
        return expression.exclude === false;
      };

      $scope.refreshStats = function () {
        $log.log("refreshStats has not been implemented yet");
        return false;
      };

      $scope.doNothing = function ($event) {
        $event.preventDefault();
      };

      $scope.addKeywordExpression = function (kw, newKeywordExpression) {
        if (kw.addExpression(newKeywordExpression.expression, newKeywordExpression.type === "exclude")) {
          newKeywordExpression.expression = "";
        }
      };

      $scope.removeKeywordExpression = function(kw, keywordExpression) {
        kw.removeExpression(keywordExpression.expression, keywordExpression.exclude);
      };
    }
  ]);
})();
