define(['./module.js'], function () {
  'use strict';

  var module = angular.module('core/location');

  module.controller('core/location/AddPostalCodeListController', [
            '$scope', '$modalInstance', '$document', '$log',  "Restangular", 'core/common/auth/Session', 'core/common/IdGenerator',
    function($scope, $modalInstance, $document, $log,  Restangular, Session, IdGenerator) {

      $scope.input = {};
      $scope.addedPostalCodes = [];

      $scope.input.country = "";

      $scope.postalCodesList = undefined;

      $scope.$watch("input.postalCodesList", function (newValue, oldValue) {
        if(newValue === undefined || newValue === "") {
          $scope.addedPostalCodes = [];
        } else {
          $scope.addedPostalCodes = newValue.replace(/\s/g, '').split(",");
        }
      });

      $scope.done = function () {
        var postalCodeAdded;
        for (var i = 0; i < $scope.addedPostalCodes.length; i++) {
          postalCodeAdded = $scope.addedPostalCodes[i];
          $scope.$emit("mics-location:postal-code-added", {
            id: IdGenerator.getId(),
            country: $scope.input.country,
            postal_code : postalCodeAdded
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


