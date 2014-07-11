define(['./module.js'], function () {
  'use strict';

  var module = angular.module('core/keywords');

  module.controller('core/keywords/ChooseExistingKeywordListController', [
    '$scope', '$modalInstance', '$document', '$log', 'core/campaigns/DisplayCampaignService', "Restangular", 'core/common/auth/Session',
    function($scope, $modalInstance, $document, $log, DisplayCampaignService, Restangular, Session) {

      $scope.availableKeywordLists = Restangular.all("keyword_lists").getList({
        organisation_id : Session.getCurrentWorkspace().organisation_id
      }).$object;

      $scope.selectedKeywordLists = [];

      $scope.done = function() {
        var keywordList;
        for (var i = 0; i < $scope.selectedKeywordLists.length; i++) {
          keywordList = $scope.selectedKeywordLists[i];
          $scope.$emit("mics-keyword-list:selected", {
            keywordList : keywordList
          });
        }
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.close();
      };

    }
  ]);
});


