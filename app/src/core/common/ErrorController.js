define(['./module'], function (module) {

  'use strict';

  module.controller('core/common/ErrorController', [
    "$scope", "$modalInstance", "core/common/auth/Session", "$location", "$q",
    function ($scope, $modalInstance, Session, $location, $q) {

      $scope.close = function () {
        $modalInstance.close();
      };

      $scope.abort = function() {
        $modalInstance.dismiss();
        $location.path('/');
      };

    }
  ]);
});



