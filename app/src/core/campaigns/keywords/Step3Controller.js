(function(){

  'use strict';

  var module = angular.module('core/campaigns/keywords');

  module.controller('core/campaigns/keywords/Step3Controller', [
    "$scope", "$log", "Restangular", "lodash",
    function ($scope, $log, Restangular, _) {

      if (!$scope.campaign.creatives) {
        $scope.campaign.creatives = [];
      }

      $scope.deleteCreative = function (eltToDelete) {

        var idx = $scope.campaign.creatives.indexOf(eltToDelete);
        if(idx === -1) {
          $log.warn("micsListCreatives: trying to delete an unknown elt", eltToDelete);
          return;
        }

        $scope.campaign.creatives.splice(idx, 1);
      };


      $scope.$on("mics-creative:selected", function (event, params) {
        var existing = _.find($scope.campaign.creatives, function (crea) {return crea.id === params.creative.id;});
        if(!existing) {
          $scope.campaign.creatives.push(params.creative);
        }
      });

      $scope.previous = function () {
        $scope.container.step = "step2";
      };

      $scope.next = function () {
        $scope.container.step = "step4";
      };
    }
  ]);
})();


