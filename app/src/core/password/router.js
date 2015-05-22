define(['./module'], function (module) {
  "use strict";

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('update-password', {
          url: '/update-password',
          templateUrl: 'src/core/password/update-password.html'
        });
    }
  ]);

});
