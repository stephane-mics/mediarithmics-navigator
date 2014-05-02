(function(){
  'use strict';


  var module = angular.module('core/creative');
  module.directive('creativeThumbnail', [
    "Restangular",
    function (Restangular) {
      var CreativeRestangular = Restangular.withConfig(
        function(RestangularConfigurer) {
//          RestangularConfigurer.setDefaultHttpFields({cache: true});
      });

      return {
        restrict: 'E',
        scope: {
          creativeId: '=creativeId'
        },
        controller:function ($scope) {
          $scope.creative = CreativeRestangular.one("creatives", $scope.creativeId).get().$object;

        },
        templateUrl:"src/core/creatives/creative-thumbnail.html"
      };
    }
  ]);




})();

