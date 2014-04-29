(function(){
  'use strict';


  var module = angular.module('core/creative');
  module.directive('creativeThumbnail', [
    "Restangular",
    function (Restangular) {
      return {
        restrict: 'E',
        scope: {
          creativeId: '=creativeId'
        },
        controller:function ($scope) {
          $scope.creative = Restangular.one("creatives", $scope.creativeId).get().$object

        },
        templateUrl:"src/core/creative/creative-thumbnail.html"
      }
    }
  ]);




})();

