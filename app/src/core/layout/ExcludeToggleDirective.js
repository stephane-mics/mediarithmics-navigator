define(['./module'], function (module) {
  'use strict';

  module.directive("micsExcludeToggle", [
    function () {
      return {
        restrict: 'EA',
        replace: true,
        templateUrl: "src/core/layout/excludeToggleTemplate.html",
        scope : {
          "toggle" : "=micsExcludeToggle"
        },
        controller : [
          "$scope",
          function ($scope) {
            $scope.id = "toggle-input-" + Math.random();
          }
        ]
      };
    }
  ]);
});



