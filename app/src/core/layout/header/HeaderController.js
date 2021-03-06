define(['./module'], function (module) {
  'use strict';

  /* Searches for the right navbar */
  module.controller('HeaderController', [
    '$scope', '$state', '$stateParams', '$log',
    function ($scope, $state) {
      $scope.findNavbar = function() {
        if (typeof $state.current.data === 'undefined') {
          return 'src/core/layout/header/navbar/navigator-navbar/navigator-navbar.html';
        }
        return $state.current.data.navbar;
      };
    }
  ]);
});


